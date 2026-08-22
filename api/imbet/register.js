const USERNAME_RE = /^[A-Za-z0-9_]{3,32}$/;

function getConfig() {
  return {
    url: (process.env.SUPABASE_URL || '').replace(/\/$/, ''),
    key: process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  };
}

function emailFor(username) {
  return `${username.toLowerCase()}@accounts.imbet11.local`;
}

async function supabaseRequest(url, key, init = {}) {
  return fetch(url, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const { username, password, name = '', phone = '' } = req.body || {};
  if (typeof username !== 'string' || !USERNAME_RE.test(username)) {
    return res.status(400).json({ ok: false, error: 'invalid_username' });
  }
  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ ok: false, error: 'invalid_password' });
  }

  const { url, key } = getConfig();
  if (!url || !key) return res.status(503).json({ ok: false, error: 'local_auth_not_configured' });

  try {
    const email = emailFor(username);
    const createResponse = await supabaseRequest(`${url}/auth/v1/admin/users`, key, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          username,
          name: typeof name === 'string' ? name.trim() : '',
          phone: typeof phone === 'string' ? phone.trim() : '',
        },
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.json().catch(() => ({}));
      const duplicate = createResponse.status === 422 || /already|exists|taken/i.test(error?.msg || error?.message || '');
      return res.status(duplicate ? 409 : createResponse.status).json({
        ok: false,
        error: duplicate ? 'username_already_exists' : 'registration_failed',
      });
    }

    const loginResponse = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { apikey: key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const session = await loginResponse.json();
    if (!loginResponse.ok || typeof session.access_token !== 'string') {
      return res.status(502).json({ ok: false, error: 'local_session_creation_failed' });
    }

    return res.status(201).json({
      ok: true,
      token: session.access_token,
      user: {
        username,
        name: typeof name === 'string' ? name.trim() : '',
        phone: typeof phone === 'string' ? phone.trim() : '',
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
