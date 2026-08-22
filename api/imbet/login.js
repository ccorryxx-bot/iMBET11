function getConfig() {
  return {
    url: (process.env.SUPABASE_URL || '').replace(/\/$/, ''),
    key: process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  };
}

function emailFor(username) {
  return `${username.toLowerCase()}@accounts.imbet11.local`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
    return res.status(400).json({ ok: false, error: 'missing_login_fields' });
  }

  const { url, key } = getConfig();
  if (!url || !key) return res.status(503).json({ ok: false, error: 'local_auth_not_configured' });

  try {
    const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { apikey: key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailFor(username), password }),
    });
    const data = await response.json();
    if (!response.ok || typeof data.access_token !== 'string') {
      return res.status(401).json({ ok: false, error: 'invalid_credentials' });
    }

    const metadata = data.user?.user_metadata || {};
    return res.status(200).json({
      ok: true,
      token: data.access_token,
      user: {
        username: metadata.username || username,
        name: metadata.name || '',
        phone: metadata.phone || '',
        balance: 0,
      },
    });
  } catch (error) {
    return res.status(502).json({
      ok: false,
      error: 'local_auth_network_error',
      details: error instanceof Error ? error.message : 'Unknown network error',
    });
  }
}
