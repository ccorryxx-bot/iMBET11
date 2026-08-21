const BUFFALO_WIN = {
  id: 248,
  uid: 'd8444d05-8b50-48ae-8869-07225e78a757',
  game_name: 'Buffalo Win',
  game_image: 'PG Soft_108_108.png',
  game_type: 'SLOT',
  game_provider: '1007',
  game_uuid: '108',
  has_lobby: 0,
  is_mobile: 0,
  has_freespins: 0,
  has_tables: 0,
  has_demo: 0,
  freespin_valid_until_full_day: '0',
  technology: '',
  status: 'active',
  provider: 'PG Soft',
  is_new: 0,
  is_favorite: 0,
  category: 'slot',
  merchant: 'gsapi',
  order: 40,
  is_buffalo: 0,
  is_skm: 0,
  is_slot: 0,
  is_fish: 0,
  is_arcade: 0,
};

function getBearerToken(req) {
  const header = req.headers.authorization || '';
  if (header.toLowerCase().startsWith('bearer ')) return header.slice(7).trim();
  return process.env.ULTRASPIN_ACCESS_TOKEN || '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const token = getBearerToken(req);
  if (!token) {
    return res.status(500).json({ ok: false, error: 'missing_provider_token' });
  }

  try {
    // UltraSpin's observed frontend sends the complete clicked game object.
    const response = await fetch('https://api.ultraspin168.com/api/launchGame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(BUFFALO_WIN),
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
      return res.status(502).json({
        ok: false,
        error: 'invalid_provider_launch_response',
      });
    }

    // For PG Soft code 1007 the observed response is HTML launcher content,
    // not a normal external URL. The browser will load it via a Blob URL.
    return res.status(200).json({ ok: true, html: launcher });
  } catch (error) {
    return res.status(502).json({
      ok: false,
      error: 'provider_network_error',
      details: error instanceof Error ? error.message : 'Unknown network error',
    });
  }
}
