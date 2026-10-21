import test from "node:test";
import assert from "node:assert/strict";
import {
  createInitialState,
  issueTicket,
  ticketPayload,
  validateTicket,
} from "../src/lib/model.mjs";
import {
  emptyMemberWallet,
  restoreMemberWallet,
  saveMemberTicket,
} from "../src/lib/member-tickets.mjs";
import { prepareOfflineList, scanOfflineList } from "../src/lib/offline.mjs";

const stamp = "2026-12-12T16:00:00.000Z";
const save = (state, wallet = emptyMemberWallet(), ticket = state.tickets[0]) =>
  saveMemberTicket(
    wallet,
    ticket,
    state.events.find((event) => event.id === ticket.eventId),
    stamp,
  );

test("salvar o ingresso preserva o mesmo QR e não registra uma entrada", () => {
  const state = createInitialState();
  const result = save(state);
  assert.equal(result.saved.payload, ticketPayload(state.tickets[0]));
  assert.equal(result.saved.ticket.id, state.tickets[0].id);
  assert.equal(result.saved.ticket.personId, undefined);
  assert.equal(result.saved.event.image, undefined);
  assert.equal(state.tickets[0].status, "available");
  assert.equal(state.checkins.length, 0);
  state.tickets[0].name = "Nome atualizado";
  state.events[0].name = "Evento atualizado";
  assert.equal(result.saved.ticket.name, "Marina Costa");
  assert.equal(result.saved.event.name, "Encontro de Verão");
});

test("atualização substitui a cópia do ingresso e preserva os demais salvos", () => {
  const state = issueTicket(createInitialState(), "verao", "rafael").state;
  const a = save(state);
  const b = save(state, a.wallet, state.tickets[1]);
  const changed = { ...state.tickets[0], name: "Marina Atualizada" };
  const refreshed = saveMemberTicket(
    b.wallet,
    changed,
    state.events[0],
    "2026-12-12T17:00:00.000Z",
  );
  assert.equal(refreshed.wallet.tickets.length, 2);
  assert.equal(refreshed.saved.ticket.name, "Marina Atualizada");
  assert.equal(refreshed.saved.savedAt, "2026-12-12T17:00:00.000Z");
  assert.ok(
    refreshed.wallet.tickets.some(
      (item) => item.ticket.id === state.tickets[1].id,
    ),
  );
});

test("não salva ingresso pendente, cancelado, usado ou de evento incompatível", () => {
  const state = createInitialState();
  for (const status of ["pending", "cancelled", "used"]) {
    const wallet = emptyMemberWallet();
    const result = saveMemberTicket(
      wallet,
      { ...state.tickets[0], status },
      state.events[0],
    );
    assert.ok(result.error);
    assert.equal(result.wallet, wallet);
  }
  assert.ok(
    saveMemberTicket(emptyMemberWallet(), state.tickets[0], state.events[1])
      .error,
  );
  assert.ok(
    saveMemberTicket(emptyMemberWallet(), state.tickets[0], {
      ...state.events[0],
      status: "draft",
    }).error,
  );
});

test("restaura as cópias salvas e rejeita payload adulterado ou dados corrompidos", () => {
  const state = createInitialState();
  const { wallet, saved } = save(state);
  assert.deepEqual(restoreMemberWallet(JSON.stringify(wallet)), wallet);
  for (const raw of [
    null,
    "corrompido",
    JSON.stringify({ ...wallet, version: 2 }),
    JSON.stringify({ ...wallet, tickets: [null] }),
    JSON.stringify({
      ...wallet,
      tickets: [{ ...saved, payload: "OUTRO-CODIGO" }],
    }),
    JSON.stringify({
      ...wallet,
      tickets: [{ ...saved, event: { ...saved.event, date: "data-invalida" } }],
    }),
    JSON.stringify({ ...wallet, tickets: [saved, saved] }),
  ]) {
    assert.deepEqual(restoreMemberWallet(raw), emptyMemberWallet());
  }
});

test("QR salvo do associado funciona com a lista offline da portaria", () => {
  const state = createInitialState();
  const member = restoreMemberWallet(JSON.stringify(save(state).wallet));
  const gate = prepareOfflineList(
    state,
    "verao",
    null,
    stamp,
    "portaria-a",
  ).list;
  const checked = scanOfflineList(
    gate,
    member.tickets[0].payload,
    "verao",
    stamp,
  );
  assert.equal(checked.result.status, "authorized");
  assert.equal(checked.list.entries[0].ticketId, member.tickets[0].ticket.id);
  assert.equal(
    scanOfflineList(checked.list, member.tickets[0].payload, "verao").result
      .status,
    "used",
  );
});

test("cópia salva não autoriza entrada após cancelamento na base consultada pela portaria", () => {
  const state = createInitialState();
  const { saved } = save(state);
  const cancelled = {
    ...state,
    tickets: [{ ...state.tickets[0], status: "cancelled" }],
  };
  const checked = validateTicket(cancelled, saved.payload, "verao");
  assert.equal(checked.result.status, "invalid");
  assert.equal(checked.result.title, "Ingresso cancelado");
  assert.equal(cancelled.checkins.length, 0);
  assert.equal(saved.ticket.status, "available");
});
