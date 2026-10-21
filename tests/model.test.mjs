import test from "node:test";
import assert from "node:assert/strict";
import {
  confirmBill,
  createEvent,
  createInitialState,
  issueGuestTicket,
  issueTicket,
  restoreState,
  ticketPayload,
  validateTicket,
} from "../src/lib/model.mjs";
import QRCode from "qrcode";
import jsQR from "jsqr";

const eventInput = {
  name: "Evento de teste",
  date: "2026-12-22",
  time: "18:30",
  location: "Sede social",
  capacity: 20,
  memberPrice: 0,
  guestPrice: 40,
};

test("restaura uma demonstração válida e rejeita versões incompatíveis ou JSON corrompido", () => {
  const state = createInitialState();
  assert.deepEqual(restoreState(JSON.stringify(state)), state);
  for (const raw of [
    null,
    "invalid",
    '{"version":2}',
    '{"version":1,"family":[]}',
  ])
    assert.equal(restoreState(raw).tickets[0].id, "CCB-DEMO-001");
});

test("cada estado inicial possui suas próprias entidades", () => {
  const first = createInitialState();
  first.family[0].name = "Mudou";
  first.events[0].capacity = 1;
  const second = createInitialState();
  assert.equal(second.family[0].name, "Marina Costa");
  assert.equal(second.events[0].capacity, 150);
});

test("publicar um evento preserva o estado anterior e seus limites", () => {
  const initial = createInitialState();
  const result = createEvent(initial, eventInput, "evento-teste");
  assert.equal(result.error, undefined);
  assert.equal(result.event.status, "published");
  assert.equal(result.state.events.length, initial.events.length + 1);
  assert.equal(initial.events.length, 3);
  assert.equal(result.event.capacity, 20);
  assert.equal(result.event.guestPrice, 40);
});

test("valida nome, capacidade, valores e datas reais antes de publicar", () => {
  const state = createInitialState();
  for (const invalid of [
    { name: "" },
    { capacity: 0 },
    { capacity: 1.5 },
    { capacity: 10001 },
    { guestPrice: -1 },
    { memberPrice: "bad" },
    { date: "2026-02-31" },
    { date: "2026-13-01" },
    { time: "27:00" },
    { location: "" },
  ]) {
    const result = createEvent(state, { ...eventInput, ...invalid });
    assert.ok(result.error, JSON.stringify(invalid));
    assert.equal(result.state, state);
  }
});

test("um rascunho não permite emitir ingresso e identificadores de evento não se repetem", () => {
  const result = createEvent(
    createInitialState(),
    { ...eventInput, status: "draft" },
    "rascunho",
  );
  assert.equal(result.event.status, "draft");
  assert.ok(issueTicket(result.state, "rascunho", "marina").error);
  assert.ok(createEvent(result.state, eventInput, "rascunho").error);
});

test("emite ingresso individual para dependente e impede inscrição duplicada", () => {
  const initial = createInitialState();
  const result = issueTicket(initial, "verao", "luiza");
  assert.equal(result.ticket.category, "Dependente");
  assert.equal(result.ticket.status, "available");
  assert.equal(initial.tickets.length, 1);
  const repeated = issueTicket(result.state, "verao", "luiza");
  assert.ok(repeated.error);
  assert.equal(repeated.state.tickets.length, 2);
  assert.equal(repeated.ticket.id, result.ticket.id);
});

test("bloqueia inscrição quando a capacidade foi preenchida", () => {
  const state = createInitialState();
  state.events[0].capacity = 1;
  const result = issueTicket(state, "verao", "rafael");
  assert.ok(result.error.includes("capacidade"));
  assert.equal(result.state, state);
});

test("ingresso pago é emitido somente após a confirmação de demonstração", () => {
  const state = createInitialState();
  const pending = issueTicket(state, "tenis", "marina");
  assert.equal(pending.requiresPayment, true);
  assert.equal(pending.amount, 25);
  assert.equal(pending.state.tickets.length, 1);
  const paid = issueTicket(state, "tenis", "marina", true);
  assert.equal(paid.ticket.status, "available");
  assert.equal(paid.state.tickets.length, 2);
});

test("leitura válida registra exatamente uma entrada e impede a reutilização", () => {
  const state = createInitialState();
  const payload = ticketPayload(state.tickets[0]);
  const first = validateTicket(state, payload, "verao", "2026-12-12T21:00:00Z");
  assert.equal(first.result.status, "authorized");
  assert.equal(first.state.checkins.length, 1);
  assert.equal(first.state.tickets[0].status, "used");
  assert.equal(state.tickets[0].status, "available");
  const second = validateTicket(first.state, payload, "verao");
  assert.equal(second.result.status, "used");
  assert.equal(second.state.checkins.length, 1);
  assert.equal(second.state, first.state);
});

test("rejeita ingresso de outro evento, cancelado ou ainda não liberado", () => {
  const state = createInitialState();
  assert.equal(
    validateTicket(state, "CCB-DEMO-001", "tenis").result.status,
    "invalid",
  );
  assert.equal(state.checkins.length, 0);
  state.tickets[0].status = "cancelled";
  assert.equal(
    validateTicket(state, "CCB-DEMO-001", "verao").result.title,
    "Ingresso cancelado",
  );
  state.tickets[0].status = "pending";
  assert.equal(
    validateTicket(state, "CCB-DEMO-001", "verao").result.title,
    "Ingresso não liberado",
  );
});

test("código desconhecido ou adulterado não produz registros de entrada", () => {
  const state = createInitialState();
  for (const raw of [
    "",
    "CCB-DEMO-999",
    "CCB-DEMO|2|verao|CCB-DEMO-001",
    "CCB-DEMO|1|tenis|CCB-DEMO-001",
    "CCB-DEMO|1|verao|CCB-DEMO-001|extra",
  ]) {
    const result = validateTicket(state, raw, "verao");
    assert.equal(result.result.status, "invalid");
    assert.equal(result.state.checkins.length, 0);
  }
});

test("confirmação de mensalidade é idempotente e não altera o histórico anterior", () => {
  const state = createInitialState();
  const paid = confirmBill(state, "dez");
  assert.equal(paid.bills[0].status, "paid");
  assert.equal(state.bills[0].status, "pending");
  assert.equal(confirmBill(paid, "dez"), paid);
  assert.equal(confirmBill(state, "missing"), state);
});

test("convidado usa o preço próprio e sua entrada é validada após pagamento simulado", () => {
  const state = createInitialState();
  const pending = issueGuestTicket(state, "verao", "Convidado de teste");
  assert.equal(pending.requiresPayment, true);
  assert.equal(pending.amount, 40);
  const paid = issueGuestTicket(state, "verao", "Convidado de teste", true);
  assert.equal(paid.ticket.category, "Convidado");
  assert.equal(paid.ticket.amount, 40);
  assert.equal(
    validateTicket(paid.state, ticketPayload(paid.ticket), "verao").result
      .status,
    "authorized",
  );
  assert.ok(
    issueGuestTicket(paid.state, "verao", "Convidado de teste", true).error,
  );
  assert.ok(issueGuestTicket(state, "verao", "").error);
});

test("o QR gerado é decodificado pelo leitor usado na câmera", () => {
  const payload = ticketPayload(createInitialState().tickets[0]);
  const qr = QRCode.create(payload, { errorCorrectionLevel: "M" });
  const scale = 8;
  const size = (qr.modules.size + 8) * scale;
  const data = new Uint8ClampedArray(size * size * 4).fill(255);
  for (let row = 0; row < qr.modules.size; row += 1)
    for (let column = 0; column < qr.modules.size; column += 1)
      if (qr.modules.get(row, column)) {
        for (let y = 0; y < scale; y += 1)
          for (let x = 0; x < scale; x += 1) {
            const offset =
              (((row + 4) * scale + y) * size + (column + 4) * scale + x) * 4;
            data[offset] = 16;
            data[offset + 1] = 47;
            data[offset + 2] = 61;
          }
      }
  const decoded = jsQR(data, size, size);
  assert.equal(decoded?.data, payload);
});
