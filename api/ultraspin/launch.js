import { createHash } from 'node:crypto';

const LAUNCH_FIELDS = [
  'id', 'uid', 'game_name', 'game_image', 'game_type', 'game_provider', 'game_uuid',
  'has_lobby', 'is_mobile', 'has_freespins', 'has_tables', 'has_demo',
  'freespin_valid_until_full_day', 'technology', 'status', 'provider', 'is_new',
  'is_favorite', 'category', 'merchant', 'order', 'is_buffalo', 'is_skm',
  'is_slot', 'is_fish', 'is_arcade',
];

function getLocalSessionToken(req) {
  const header = req.headers.authorization || '';
  return header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : '';
}

function getSupabaseConfig() {
  return {
    url: (process.env.SUPABASE_URL || '').replace(/\/$/, ''),
    key: process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  };
}

function pickLaunchRecord(record) {
  return Object.fromEntries(
    LAUNCH_FIELDS
      .filter((field) => Object.prototype.hasOwnProperty.call(record, field))
      .map((field) => [field, record[field]]),
  );
}

async function verifyLocalSession(token) {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return { ok: false, error: 'local_auth_not_configured' };
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  if (!response.ok) return { ok: false, error: 'invalid_local_session' };
  return { ok: true, user: await response.json() };
}

function providerIdentityFor(localUser) {
  const localId = typeof localUser?.id === 'string' ? localUser.id : '';
  const secret = process.env.ULTRASPIN_PROVISIONING_SECRET
    || process.env.SUPABASE_SERVICE_ROLE_KEY
    || process.env.SUPABASE_KEY;
  if (!localId || !secret) return null;

  const digest = createHash('sha256').update(`${secret}:${localId}`).digest('hex');
  const digits = [...digest]
    .map((character) => String(parseInt(character, 16) % 10))
    .join('');

  return {
    username: `i11${digest.slice(0, 20)}`,
    password: `I11${digest.slice(20, 44)}x`,
    phone: `09${digits.slice(0, 9)}`,
    bank_type: 'other',
    bank_acc_or_ph: `7${digits.slice(9, 18)}`,
    name: 'IMBET11 TEST',
    invite_code: null,
    // The provider site uses a client-side six-character captcha. Its API
    // accepted this field during the verified disposable-account test.
    captcha_value: '123456',
  };
}

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    // Keep provider parse failures internal; callers receive a safe status.
  }
  return { response, data };
}

function isAlreadyRegistered(data) {
  const message = String(data?.message || data?.error || '').toLowerCase();
  return message.includes('username has already been taken')
    || message.includes('phone has already been taken');
}

async function resolveProviderContext(localUser) {
  const identity = providerIdentityFor(localUser);
  if (!identity) return null;

  const providerBase = 'https://api.ultraspin168.com/api';
  const registration = await requestJson(`${providerBase}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(identity),
  });

  // Registration is intentionally idempotent for a deterministic local-user
  // identity. A known duplicate means the provider account already exists;
  // any other failure stops before launch.
  if (!registration.response.ok && !isAlreadyRegistered(registration.data)) return null;

  const login = await requestJson(`${providerBase}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ username: identity.username, password: identity.password }),
  });
  const accessToken = login.data?.results?.authorisation?.token;
  if (!login.response.ok || typeof accessToken !== 'string' || accessToken.length < 20) return null;

  return { accessToken };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const localToken = getLocalSessionToken(req);
  if (!localToken) return res.status(401).json({ ok: false, error: 'missing_local_session' });

  const gameRecord = req.body?.gameRecord;
  if (!gameRecord || typeof gameRecord !== 'object') {
    return res.status(400).json({ ok: false, error: 'missing_game_record' });
  }
  if (String(gameRecord.game_provider) !== '1007' || String(gameRecord.game_uuid) !== '108') {
    return res.status(400).json({ ok: false, error: 'provider_launch_not_connected' });
  }

  try {
    const localSession = await verifyLocalSession(localToken);
    if (!localSession.ok) return res.status(503).json(localSession);

    const providerContext = await resolveProviderContext(localSession.user);
    if (!providerContext) {
      return res.status(503).json({
        ok: false,
        error: 'provider_context_unavailable',
        message: 'The provider test mapping could not be created or authenticated.',
      });
    }

    const launchRecord = pickLaunchRecord(gameRecord);
    if (!launchRecord.uid || !launchRecord.game_name || !launchRecord.game_provider || !launchRecord.game_uuid) {
      return res.status(400).json({ ok: false, error: 'invalid_game_record' });
    }

    const response = await fetch('https://api.ultraspin168.com/api/launchGame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${providerContext.accessToken}`,
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
