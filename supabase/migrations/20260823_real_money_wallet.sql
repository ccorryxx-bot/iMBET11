-- iMBET11 real-money foundation
-- This migration creates the internal wallet/ledger foundation only.
-- Provider callback field names and signature rules remain disabled until
-- UltraSpin supplies an exact merchant callback specification.

create table if not exists public.player_wallets (
  player_id uuid primary key references auth.users(id) on delete cascade,
  currency text not null default 'MMK',
  balance_minor bigint not null default 0 check (balance_minor >= 0),
  status text not null default 'active' check (status in ('active', 'suspended', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.player_provider_links (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references auth.users(id) on delete cascade,
  provider_code text not null,
  external_account text not null,
  provider_user_uid text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (player_id, provider_code),
  unique (provider_code, external_account)
);

create table if not exists public.wallet_ledger (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references auth.users(id) on delete restrict,
  provider_code text not null,
  entry_type text not null check (entry_type in ('bet', 'settle', 'rollback', 'bonus', 'adjustment')),
  amount_minor bigint not null check (amount_minor <> 0),
  balance_before_minor bigint not null check (balance_before_minor >= 0),
  balance_after_minor bigint not null check (balance_after_minor >= 0),
  transaction_id text not null,
  round_id text,
  reversal_of uuid references public.wallet_ledger(id),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (provider_code, transaction_id, entry_type)
);

create table if not exists public.provider_callback_events (
  id uuid primary key default gen_random_uuid(),
  provider_code text not null,
  request_id text,
  payload_hash text not null,
  raw_payload jsonb not null,
  signature_present boolean not null default false,
  signature_valid boolean,
  processing_status text not null default 'received' check (processing_status in ('received', 'accepted', 'rejected', 'manual_review')),
  rejection_reason text,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  unique (provider_code, payload_hash)
);

create index if not exists wallet_ledger_player_created_idx
  on public.wallet_ledger (player_id, created_at desc);
create index if not exists callback_events_provider_received_idx
  on public.provider_callback_events (provider_code, received_at desc);

alter table public.player_wallets enable row level security;
alter table public.player_provider_links enable row level security;
alter table public.wallet_ledger enable row level security;
alter table public.provider_callback_events enable row level security;

drop policy if exists player_wallets_self_read on public.player_wallets;
create policy player_wallets_self_read
  on public.player_wallets for select
  to authenticated
  using (player_id = auth.uid());

drop policy if exists provider_links_self_read on public.player_provider_links;
create policy provider_links_self_read
  on public.player_provider_links for select
  to authenticated
  using (player_id = auth.uid());

drop policy if exists wallet_ledger_self_read on public.wallet_ledger;
create policy wallet_ledger_self_read
  on public.wallet_ledger for select
  to authenticated
  using (player_id = auth.uid());

-- No client role can write wallets, mappings, ledger rows, or callback events.
revoke all on public.player_wallets from anon, authenticated;
revoke all on public.player_provider_links from anon, authenticated;
revoke all on public.wallet_ledger from anon, authenticated;
revoke all on public.provider_callback_events from anon, authenticated;
grant select on public.player_wallets, public.player_provider_links, public.wallet_ledger to authenticated;

create or replace function public.apply_wallet_entry(
  p_player_id uuid,
  p_provider_code text,
  p_entry_type text,
  p_amount_minor bigint,
  p_transaction_id text,
  p_round_id text default null,
  p_reversal_of uuid default null,
  p_metadata jsonb default '{}'::jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_before bigint;
  v_after bigint;
  v_ledger_id uuid;
  v_existing public.wallet_ledger;
begin
  if p_player_id is null or nullif(trim(p_provider_code), '') is null
     or nullif(trim(p_entry_type), '') is null
     or nullif(trim(p_transaction_id), '') is null
     or p_amount_minor = 0 then
    raise exception 'invalid_wallet_entry';
  end if;

  if p_entry_type not in ('bet', 'settle', 'rollback', 'bonus', 'adjustment') then
    raise exception 'invalid_wallet_entry_type';
  end if;

  select * into v_existing
    from public.wallet_ledger
   where provider_code = p_provider_code
     and transaction_id = p_transaction_id
     and entry_type = p_entry_type;
  if found then
    return jsonb_build_object(
      'status', 'duplicate',
      'ledger_id', v_existing.id,
      'balance_after_minor', v_existing.balance_after_minor
    );
  end if;

  insert into public.player_wallets (player_id)
  values (p_player_id)
  on conflict (player_id) do nothing;

  select balance_minor into v_before
    from public.player_wallets
   where player_id = p_player_id
   for update;

  v_after := v_before + p_amount_minor;
  if v_after < 0 then
    raise exception 'insufficient_balance';
  end if;

  update public.player_wallets
     set balance_minor = v_after,
         updated_at = now()
   where player_id = p_player_id;

  insert into public.wallet_ledger (
    player_id, provider_code, entry_type, amount_minor,
    balance_before_minor, balance_after_minor, transaction_id,
    round_id, reversal_of, metadata
  ) values (
    p_player_id, p_provider_code, p_entry_type, p_amount_minor,
    v_before, v_after, p_transaction_id,
    p_round_id, p_reversal_of, coalesce(p_metadata, '{}'::jsonb)
  ) returning id into v_ledger_id;

  return jsonb_build_object(
    'status', 'applied',
    'ledger_id', v_ledger_id,
    'balance_after_minor', v_after
  );
end;
$$;

revoke all on function public.apply_wallet_entry(uuid, text, text, bigint, text, text, uuid, jsonb)
  from public, anon, authenticated;
grant execute on function public.apply_wallet_entry(uuid, text, text, bigint, text, text, uuid, jsonb)
  to service_role;
