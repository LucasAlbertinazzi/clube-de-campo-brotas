import test from "node:test";
import assert from "node:assert/strict";
import {
  createInitialState,
  issueTicket,
  ticketPayload,
} from "../src/lib/model.mjs";
import {
  prepareOfflineList,
  restoreOfflineList,
  scanOfflineList,
  syncOfflineList,
} from "../src/lib/offline.mjs";

const stamp = "2026-12-12T20:00:00.000Z";
const download = (state, id = "device-a") =>
  prepareOfflineList(state, "verao", null, stamp, id).list;

test("lista baixada contém uma cópia mínima dos ingressos do evento", () => {
  const state = createInitialState();
  const list = download(state);
  assert.equal(list.event.id, "verao");
  assert.equal(list.tickets.length, 1);
  assert.equal(list.tickets[0].personId, undefined);
  assert.equal(list.bills, undefined);
  state.tickets[0].name = "Nome alterado depois";
  assert.equal(list.tickets[0].name, "Marina Costa");
  assert.ok(prepareOfflineList(state, "inexistente").error);
});

test("leitura offline salva uma pendência e bloqueia repetição sem alterar a base online", () => {
  const state = createInitialState();
  const list = download(state);
  const first = scanOfflineList(
    list,
    ticketPayload(state.tickets[0]),
    "verao",
    stamp,
  );
  assert.equal(first.result.status, "authorized");
  assert.equal(first.list.entries[0].status, "pending");
  assert.equal(first.list.entries.length, 1);
  assert.equal(first.list.tickets[0].status, "used");
  assert.equal(state.tickets[0].status, "available");
  assert.equal(state.checkins.length, 0);
  const repeat = scanOfflineList(first.list, "CCB-DEMO-001", "verao", stamp);
  assert.equal(repeat.result.status, "used");
  assert.equal(repeat.list.entries.length, 1);
});

test("offline exige a lista certa e rejeita código adulterado, desconhecido ou não liberado", () => {
  const state = createInitialState();
  const list = download(state);
  for (const code of [
    "CODIGO-INVALIDO",
    "CCB-DEMO|1|familia|CCB-DEMO-001",
    "CCB-DEMO|2|verao|CCB-DEMO-001",
  ]) {
    assert.equal(scanOfflineList(list, code, "verao").result.status, "invalid");
  }
  assert.equal(
    scanOfflineList(null, "CCB-DEMO-001", "verao").result.status,
    "invalid",
  );
  assert.equal(
    scanOfflineList(list, "CCB-DEMO-001", "familia").result.status,
    "invalid",
  );
  for (const status of ["pending", "cancelled"]) {
    const changed = { ...state, tickets: [{ ...state.tickets[0], status }] };
    assert.equal(
      scanOfflineList(download(changed), "CCB-DEMO-001", "verao").result.status,
      "invalid",
    );
  }
});

test("ingresso emitido depois do download só entra em uma lista atualizada", () => {
  const state = createInitialState();
  const oldList = download(state);
  const issued = issueTicket(state, "verao", "rafael");
  assert.equal(
    scanOfflineList(oldList, ticketPayload(issued.ticket), "verao").result
      .status,
    "invalid",
  );
  assert.equal(
    scanOfflineList(
      download(issued.state),
      ticketPayload(issued.ticket),
      "verao",
    ).result.status,
    "authorized",
  );
});

test("outro download não descarta entradas ainda pendentes", () => {
  const state = createInitialState();
  const pending = scanOfflineList(
    download(state),
    "CCB-DEMO-001",
    "verao",
    stamp,
  ).list;
  const attempted = prepareOfflineList(state, "familia", pending);
  assert.ok(attempted.error);
  assert.equal(attempted.list, pending);
});

test("sincronização registra uma entrada e reenvio não duplica o registro", () => {
  const state = createInitialState();
  const pending = scanOfflineList(
    download(state),
    "CCB-DEMO-001",
    "verao",
    stamp,
  ).list;
  const synced = syncOfflineList(state, pending);
  assert.equal(synced.synced, 1);
  assert.equal(synced.conflicts, 0);
  assert.equal(synced.list.entries[0].status, "synced");
  assert.equal(synced.state.checkins.length, 1);
  assert.equal(synced.state.checkins[0].at, stamp);
  assert.equal(synced.state.tickets[0].status, "used");
  const resent = syncOfflineList(synced.state, pending);
  assert.equal(resent.state.checkins.length, 1);
  assert.equal(resent.conflicts, 0);
  assert.equal(resent.list.entries[0].status, "synced");
  assert.equal(syncOfflineList(synced.state, synced.list).synced, 0);
});

test("dois aparelhos sem conexão podem aceitar o mesmo ingresso e o segundo gera conflito ao sincronizar", () => {
  const state = createInitialState();
  const a = scanOfflineList(
    download(state, "device-a"),
    "CCB-DEMO-001",
    "verao",
    stamp,
  );
  const b = scanOfflineList(
    download(state, "device-b"),
    "CCB-DEMO-001",
    "verao",
    stamp,
  );
  assert.equal(a.result.status, "authorized");
  assert.equal(b.result.status, "authorized");
  const firstSync = syncOfflineList(state, a.list);
  const secondSync = syncOfflineList(firstSync.state, b.list);
  assert.equal(secondSync.synced, 0);
  assert.equal(secondSync.conflicts, 1);
  assert.equal(secondSync.list.entries[0].status, "conflict");
  assert.equal(secondSync.state.checkins.length, 1);
});

test("cancelamento posterior ao download é detectado na reconciliação", () => {
  const state = createInitialState();
  const list = download(state);
  const cancelled = {
    ...state,
    tickets: [{ ...state.tickets[0], status: "cancelled" }],
  };
  const offline = scanOfflineList(list, "CCB-DEMO-001", "verao", stamp);
  assert.equal(offline.result.status, "authorized");
  const result = syncOfflineList(cancelled, offline.list);
  assert.equal(result.conflicts, 1);
  assert.equal(result.synced, 0);
  assert.equal(result.list.entries[0].reason, "Ingresso cancelado");
  assert.equal(result.state.checkins.length, 0);
});

test("restauração preserva fila e bloqueio de repetição e rejeita dados incompatíveis", () => {
  const state = createInitialState();
  const list = scanOfflineList(
    download(state),
    "CCB-DEMO-001",
    "verao",
    stamp,
  ).list;
  const restored = restoreOfflineList(JSON.stringify(list));
  assert.deepEqual(restored, list);
  assert.equal(
    scanOfflineList(restored, "CCB-DEMO-001", "verao").result.status,
    "used",
  );
  for (const raw of [
    null,
    "corrompido",
    JSON.stringify({ ...list, version: 2 }),
    JSON.stringify({ ...list, tickets: [{}] }),
    JSON.stringify({ ...list, entries: [{}] }),
  ]) {
    assert.equal(restoreOfflineList(raw), null);
  }
});
