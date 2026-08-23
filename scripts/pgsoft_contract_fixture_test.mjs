import assert from 'node:assert/strict';

const state = {
  balanceMinor: 100000,
  processed: new Map(),
  ledger: [],
};

function decimalToMinor(value) {
  const text = String(value);
  assert.match(text, /^-?\d+(?:\.\d{1,2})?$/);
  const negative = text.startsWith('-');
  const unsigned = negative ? text.slice(1) : text;
  const [whole, fraction = ''] = unsigned.split('.');
  const minor = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  return negative ? -minor : minor;
}

function response(data = null, error = null) {
  return { data, error };
}

function parseForm(form) {
  return Object.fromEntries(new URLSearchParams(form));
}

function validateAuth(body) {
  assert.equal(body.operator_token, 'TEST_OPERATOR_TOKEN');
  assert.equal(body.secret_key, 'TEST_SECRET_KEY');
}

function handleCashGet(form) {
  const body = parseForm(form);
  validateAuth(body);
  assert.ok(body.player_name);
  return response({
    currency_code: 'MMK',
    balance_amount: (state.balanceMinor / 100).toFixed(2),
    updated_time: Number(body.trace_id_time || 1700000000000),
  });
}

function handleTransferInOut(form) {
  const body = parseForm(form);
  validateAuth(body);
  assert.equal(body.player_name, 'player_test');
  assert.equal(body.currency_code, 'MMK');
  assert.equal(body.bet_type, '1');
  assert.ok(body.transaction_id);
  assert.ok(body.updated_time);

  const transactionId = body.transaction_id;
  if (state.processed.has(transactionId)) return state.processed.get(transactionId);

  const delta = decimalToMinor(body.transfer_amount);
  const before = state.balanceMinor;
  const after = before + delta;
  if (after < 0) return response(null, { code: '3202', message: 'Insufficient player balance' });

  state.balanceMinor = after;
  state.ledger.push({ transactionId, delta, before, after });
  const result = response({
    currency_code: 'MMK',
    balance_amount: (after / 100).toFixed(2),
    updated_time: Number(body.updated_time),
  });
  state.processed.set(transactionId, result);
  return result;
}

function handleAdjustment(form) {
  const body = parseForm(form);
  validateAuth(body);
  assert.ok(body.player_name);
  assert.ok(body.adjustment_transaction_id);
  assert.ok(body.adjustment_time);
  const delta = decimalToMinor(body.transfer_amount);
  const key = body.adjustment_transaction_id;
  if (state.processed.has(key)) return state.processed.get(key);

  const before = state.balanceMinor;
  const after = before + delta;
  if (after < 0) return response(null, { code: '3202', message: 'Insufficient player balance' });
  state.balanceMinor = after;
  const result = response({
    adjust_amount: (delta / 100).toFixed(2),
    balance_before: (before / 100).toFixed(2),
    balance_after: (after / 100).toFixed(2),
    updated_time: Number(body.adjustment_time),
  });
  state.processed.set(key, result);
  return result;
}

function handleUpdateBetDetail(form) {
  const body = parseForm(form);
  validateAuth(body);
  const details = JSON.parse(body.bet_details);
  assert.ok(Array.isArray(details));
  assert.ok(details.every((item) => item.bet_id && item.end_time));
  return response({ is_success: true });
}

const transferBase = new URLSearchParams({
  operator_token: 'TEST_OPERATOR_TOKEN',
  secret_key: 'TEST_SECRET_KEY',
  player_name: 'player_test',
  game_id: '108',
  parent_bet_id: 'parent-1',
  bet_id: 'bet-1',
  bet_type: '1',
  currency_code: 'MMK',
  create_time: '1700000000000',
  updated_time: '1700000001000',
  bet_amount: '20.00',
  win_amount: '35.00',
  transfer_amount: '-20.00',
  transaction_id: 'bet-1-parent-1-106-0',
  wallet_type: 'C',
  is_feature: 'false',
  is_end_round: 'true',
});

const cashGet = handleCashGet(new URLSearchParams({
  operator_token: 'TEST_OPERATOR_TOKEN',
  secret_key: 'TEST_SECRET_KEY',
  player_name: 'player_test',
  trace_id_time: '1700000000000',
}).toString());
assert.equal(cashGet.error, null);
assert.equal(cashGet.data.balance_amount, '1000.00');

const bet = handleTransferInOut(transferBase.toString());
assert.equal(bet.error, null);
assert.equal(bet.data.balance_amount, '980.00');
assert.equal(bet.data.updated_time, 1700000001000);

const duplicateBet = handleTransferInOut(transferBase.toString());
assert.deepEqual(duplicateBet, bet);

const win = handleTransferInOut(new URLSearchParams({
  ...Object.fromEntries(transferBase),
  transfer_amount: '35.00',
  transaction_id: 'win-1-parent-1-106-1',
  updated_time: '1700000002000',
}).toString());
assert.equal(win.error, null);
assert.equal(win.data.balance_amount, '1015.00');

const adjustment = handleAdjustment(new URLSearchParams({
  operator_token: 'TEST_OPERATOR_TOKEN',
  secret_key: 'TEST_SECRET_KEY',
  player_name: 'player_test',
  currency_code: 'MMK',
  transfer_amount: '10.00',
  adjustment_id: 'adjust-1',
  adjustment_transaction_id: 'adjust-1-900',
  adjustment_time: '1700000003000',
  transaction_type: '900',
  bet_type: '1',
}).toString());
assert.equal(adjustment.error, null);
assert.equal(adjustment.data.balance_after, '1025.00');

const duplicateAdjustment = handleAdjustment(new URLSearchParams({
  operator_token: 'TEST_OPERATOR_TOKEN',
  secret_key: 'TEST_SECRET_KEY',
  player_name: 'player_test',
  currency_code: 'MMK',
  transfer_amount: '10.00',
  adjustment_id: 'adjust-1',
  adjustment_transaction_id: 'adjust-1-900',
  adjustment_time: '1700000003000',
  transaction_type: '900',
  bet_type: '1',
}).toString());
assert.deepEqual(duplicateAdjustment, adjustment);

const update = handleUpdateBetDetail(new URLSearchParams({
  operator_token: 'TEST_OPERATOR_TOKEN',
  secret_key: 'TEST_SECRET_KEY',
  bet_details: JSON.stringify([{ bet_id: 'bet-1', end_time: '1700000004000' }]),
  updated_time: '1700000004000',
}).toString());
assert.equal(update.data.is_success, true);

const insufficient = handleTransferInOut(new URLSearchParams({
  ...Object.fromEntries(transferBase),
  transfer_amount: '-99999.00',
  transaction_id: 'too-large-1',
  updated_time: '1700000005000',
}).toString());
assert.equal(insufficient.error.code, '3202');
assert.equal(state.balanceMinor, 102500);

console.log(JSON.stringify({
  mode: 'pgsoft-documented-contract-fixture-only',
  moneyMoved: false,
  endpoints: ['Cash/Get', 'Cash/TransferInOut', 'Cash/Adjustment', 'Cash/UpdateBetDetail'],
  finalBalanceMinor: state.balanceMinor,
  idempotentTransactions: state.processed.size,
  ledgerEntries: state.ledger.length,
  insufficientBalanceError: insufficient.error.code,
}, null, 2));
