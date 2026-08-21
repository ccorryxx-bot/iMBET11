export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const { username, password, captcha_value } = req.body || {};
  if (!username || !password || !captcha_value) {
    return res.status(400).json({ ok: false, error: 'missing_login_fields' });
  }

  try {
    const response = await fetch('https://api.ultraspin168.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ username, password, captcha_value }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        error: 'provider_login_error',
        details: data?.message || data?.error || 'Login rejected by provider',
      });
    }

    const token = data?.results?.authorisation?.token;
    const providerUser = data?.results?.user;
    if (typeof token !== 'string' || !token || !providerUser) {
      return res.status(502).json({ ok: false, error: 'invalid_provider_login_response' });
    }

    // Return only the fields needed by the UI. In particular, do not expose
    // the provider's duplicated current_token or financial profile fields.
    const user = {
      username: providerUser.username || '',
      name: providerUser.profile?.name || '',
      phone: providerUser.profile?.phone || '',
      balance: Number(providerUser.wallet?.balance || 0),
      currency: providerUser.wallet?.currency || 'MMK',
    };

    // Do not log or persist credentials. The access token is returned only to
    // the requesting browser for the subsequent launch call.
    return res.status(200).json({ ok: true, token, user });
  } catch (error) {
    return res.status(502).json({
      ok: false,
      error: 'provider_network_error',
      details: error instanceof Error ? error.message : 'Unknown network error',
    });
  }
}
