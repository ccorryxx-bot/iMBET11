-- Keep wallet, provider mapping, ledger, and callback audit data behind
-- server-side service-role APIs until a reviewed client-facing read policy is needed.
revoke all on public.player_wallets from anon, authenticated;
revoke all on public.player_provider_links from anon, authenticated;
revoke all on public.wallet_ledger from anon, authenticated;
revoke all on public.provider_callback_events from anon, authenticated;
