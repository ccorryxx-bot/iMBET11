export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  return res.status(200).json({
    ok: true,
    provider: 'UltraSpin / PG Soft',
    game: 'Buffalo Win',
    configured: Boolean(process.env.ULTRASPIN_ACCESS_TOKEN),
    note: 'Token presence only; secret values are never returned.',
  });
}
