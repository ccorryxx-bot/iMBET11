# iMBET11 Real-Money Integration Rollout Plan

## Current boundary

Buffalo Win launch is verified through iMBET11-owned authentication and a server-side provider context. The frontend receives only the PG Soft HTML launcher. The system must remain **launch-only / no real-money play** until the operator wallet and provider callback contract are verified.

## Gate 1 — Provider contract evidence

Before enabling any money movement, obtain or verify the provider's exact merchant integration packet. It must define the callback URL registration process, authentication and signature format, timestamp/replay rules, request and response fields, currency and amount units, member-account mapping, timeout and retry behavior, duplicate-delivery semantics, and the exact balance, debit, settle, rollback, bonus, and error-code contracts. Public UltraSpin routes observed so far do not provide these details; the current provider-side shadow-account launch path is not a substitute for a seamless-wallet merchant contract.

## Gate 2 — Internal wallet foundation

Apply `supabase/migrations/20260823_real_money_wallet.sql` only after reviewing the database change. The migration creates `player_wallets`, `player_provider_links`, `wallet_ledger`, and `provider_callback_events`. Client roles cannot write these tables. A service-role-only database function performs a row-locked balance mutation and ledger insert together, with a unique provider transaction key for idempotency.

The internal player UUID remains the source-of-truth identity. Provider accounts use an opaque per-player mapping and never receive the user's phone number, bank data, or raw internal identifier. All money is stored as integer minor units with an explicit currency.

## Gate 3 — Callback adapter

Implement a provider-specific adapter only after the exact provider packet is available. The adapter must verify authentication and signature before touching the database, reject stale or replayed requests, normalize provider events, call the atomic wallet function, return the provider's exact success/error response, and preserve an auditable raw event record. The callback endpoint must use bounded request processing and sanitized external errors.

Required normalized events are `balance`, `bet`, `settle`, `rollback`, and `bonus`. A duplicate event must return the previously stored result without applying the balance mutation again. A rollback must reference the original transaction and be safe when delivered after a retry or out of order.

## Gate 4 — Test harness

Before any production money is enabled, replay provider-supplied fixtures and run a no-money local test suite covering insufficient balance, duplicate delivery, concurrent debit attempts, settle after bet, rollback after settle, rollback without a known bet, malformed signatures, stale timestamps, unknown players, currency mismatch, provider timeout, and provider retry. Test balances start at zero or a clearly isolated test currency and no real payment operation is used.

## Gate 5 — Deposits and withdrawals

Deposit and withdrawal flows must be implemented separately from game callbacks. Each payment provider requires its own verified webhook/signature/idempotency contract, pending/confirmed/failed state machine, reconciliation process, and manual-review path. A UI button or a provider-side `/fund` endpoint is not evidence of a safe iMBET11 payment integration. No deposit or withdrawal endpoint should be enabled until its payment provider contract is verified.

## Gate 6 — Controlled launch

Keep Buffalo launch behind a feature flag while the wallet remains in test mode. Enable real-money play only after provider approval/credentials, callback verification, database migration review, test-fixture pass, monitoring, reconciliation, rollback procedure, and operational ownership are complete. The first release should use a hard balance ceiling and a kill switch, with no autoplay or high-frequency load until callback latency and duplicate behavior are measured.

## Unavoidable dependency

The remaining external dependency is the exact UltraSpin/aggregator merchant callback and wallet contract. The current public API evidence proves catalog and launch behavior, but it does not prove the callback URL, signature, debit, settle, rollback, or settlement contract needed to process real money safely. The codebase can be prepared around the normalized boundary now, but those provider-specific wire details must not be invented.
