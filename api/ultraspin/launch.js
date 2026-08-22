const LAUNCH_FIELDS = [
  'id',
  'uid',
  'game_name',
  'game_image',
  'game_type',
  'game_provider',
  'game_uuid',
  'has_lobby',
  'is_mobile',
  'has_freespins',
  'has_tables',
  'has_demo',
  'freespin_valid_until_full_day',
  'technology',
  'status',
  'provider',
  'is_new',
  'is_favorite',
  'category',
  'merchant',
  'order',
  'is_buffalo',
  'is_skm',
  'is_slot',
  'is_fish',
  'is_arcade',
];

function getBearerToken(req) {
  const header = req.headers.authorization || '';
  if (header.toLowerCase().startsWith('bearer ')) return header.slice(7).trim();
  return process.env.ULTRASPIN_ACCESS_TOKEN || '';
}

function pickLaunchRecord(record) {
  return Object.fromEntries(
    LAUNCH_FIELDS
      .filter((field) => Object.prototype.hasOwnProperty.call(record, field))
      .map((field) => [field, record[field]]),
  );
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const token = getBearerToken(req);
  if (!token) return res.status(401).json({ ok: false, error: 'missing_provider_token' });

  const gameRecord = req.body?.gameRecord;
  if (!gameRecord || typeof gameRecord !== 'object') {
    return res.status(400).json({ ok: false, error: 'missing_game_record' });
  }

  // This integration is intentionally enabled for the observed PG Soft
  // Buffalo Win flow only. Other provider cards are catalog-visible but are
  // not sent to an incompatible launch branch yet.
  if (String(gameRecord.game_provider) !== '1007' || String(gameRecord.game_uuid) !== '108') {
    return res.status(400).json({ ok: false, error: 'provider_launch_not_connected' });
  }

  const launchRecord = pickLaunchRecord(gameRecord);
  if (!launchRecord.uid || !launchRecord.game_name || !launchRecord.game_provider || !launchRecord.game_uuid) {
    return res.status(400).json({ ok: false, error: 'invalid_game_record' });
  }

  try {
    const response = await fetch('https://api.ultraspin168.com/api/launchGame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(launchRecord),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        error: 'provider_error',
        provider_status: response.status,
        details: data?.message || data?.error || 'Unknown provider error',
      });
    }

    const launcher = data?.results?.url;
    if (typeof launcher !== 'string' || launcher.length < 100) {
      return res.status(502).json({ ok: false, error: 'invalid_provider_launch_response' });
    }

    return res.status(200).json({ ok: true, html: launcher });
  } catch (error) {
    return res.status(502).json({
      ok: false,
      error: 'provider_network_error',
      details: error instanceof Error ? error.message : 'Unknown network error',
    });
  }
}
