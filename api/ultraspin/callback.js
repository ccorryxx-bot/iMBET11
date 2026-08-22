function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(body));
}

/**
 * Fail-closed callback boundary.
 *
 * UltraSpin's public/operator bundle and live probes have not established an
 * operator callback contract, signature scheme, or response shape. Never
 * infer money-moving behavior from a different provider. This endpoint stays
 * disabled until the exact merchant packet is verified and implemented.
 */
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Allow', 'POST');
  return json(res, 503, {
    error: 'provider_callback_contract_not_configured',
    message: 'Provider callback contract is not verified; money movement is disabled.',
  });
}
