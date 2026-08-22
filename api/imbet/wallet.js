const getConfig = () => ({
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
});

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return json(res, 405, { error: 'method_not_allowed' });
  }

  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
  if (!token) return json(res, 401, { error: 'missing_authorization' });

  const { url, key } = getConfig();
  if (!url || !key) return json(res, 503, { error: 'local_auth_not_configured' });

  const userResponse = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: key, Authorization: `Bearer ${token}` },
  });
  if (!userResponse.ok) return json(res, 401, { error: 'invalid_credentials' });

  const user = await userResponse.json();
  const playerId = user?.id;
  if (!playerId) return json(res, 401, { error: 'invalid_credentials' });

  const walletResponse = await fetch(
    `${url}/rest/v1/player_wallets?select=currency,balance_minor,status&player_id=eq.${encodeURIComponent(playerId)}&limit=1`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } },
  );
  if (!walletResponse.ok) return json(res, 503, { error: 'wallet_unavailable' });

  const rows = await walletResponse.json();
  const wallet = Array.isArray(rows) && rows[0]
    ? rows[0]
    : { currency: 'MMK', balance_minor: 0, status: 'active' };

  return json(res, 200, {
    player_id: playerId,
    currency: wallet.currency,
    balance_minor: wallet.balance_minor,
    status: wallet.status,
    mode: 'read_only_until_provider_contract_is_verified',
  });
}
