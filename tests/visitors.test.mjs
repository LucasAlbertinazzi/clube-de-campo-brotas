import test from "node:test";
import assert from "node:assert/strict";
import {
  createInitialState,
  createEvent,
  restoreState,
  issueGuestTicket,
  ticketPayload,
  validateTicket,
} from "../src/lib/model.mjs";
import {
  visitorSeed,
  createVisitorProfile,
  signInVisitor,
  publicEvents,
  visitorTickets,
  memberTickets,
  issueVisitorTicket,
} from "../src/lib/visitors.mjs";
import { prepareOfflineList, scanOfflineList } from "../src/lib/offline.mjs";

test("cadastro demonstrativo usa somente e-mail fictício e não promove visitante a associado", () => {
  const { profile } = createVisitorProfile({
    name: "  Ana Exemplo  ",
    email: "ANA@example.com",
    role: "member",
  });
  assert.equal(profile.role, "visitor");
  assert.equal(profile.name, "Ana Exemplo");
  assert.equal(profile.id, "visitor-ana@example.com");
  assert.ok(
    createVisitorProfile({ name: "Ana", email: "ana@gmail.com" }).error,
  );
  assert.ok(
    createVisitorProfile({ name: "A", email: "ana@example.com" }).error,
  );
});

test("login fictício valida conta e código sem aceitar perfil de associado", () => {
  assert.equal(
    signInVisitor(visitorSeed, "JOAO@example.com", "123456").profile,
    visitorSeed,
  );
  assert.ok(signInVisitor(visitorSeed, visitorSeed.email, "000000").error);
  assert.ok(signInVisitor(visitorSeed, "outra@example.com", "123456").error);
  assert.ok(
    signInVisitor(
      { ...visitorSeed, role: "member" },
      visitorSeed.email,
      "123456",
    ).error,
  );
});

test("não sócio só vê e compra eventos publicados abertos ao público", () => {
  const state = createInitialState();
  assert.deepEqual(
    publicEvents(state).map((event) => event.id),
    ["verao", "familia"],
  );
  assert.ok(issueVisitorTicket(state, "tenis", visitorSeed, true).error);
  const draft = {
    ...state,
    events: state.events.map((event) => ({ ...event, status: "draft" })),
  };
  assert.deepEqual(publicEvents(draft), []);
  assert.ok(issueVisitorTicket(draft, "verao", visitorSeed, true).error);
  assert.ok(issueVisitorTicket(state, "verao", null, true).error);
});

test("compra independente exige pagamento do preço de não sócio antes de emitir QR", () => {
  const state = createInitialState();
  const pending = issueVisitorTicket(state, "verao", visitorSeed);
  assert.equal(pending.requiresPayment, true);
  assert.equal(pending.amount, 40);
  assert.equal(pending.state, state);
  assert.equal(pending.ticket, undefined);
  const paid = issueVisitorTicket(state, "verao", visitorSeed, true);
  assert.equal(paid.ticket.amount, 40);
  assert.equal(paid.ticket.category, "Não sócio");
  assert.equal(paid.ticket.personId, visitorSeed.id);
  assert.equal(paid.ticket.status, "available");
  assert.equal(state.tickets.length, 1);
  const invalidPrice = {
    ...state,
    events: state.events.map((event) => ({ ...event, guestPrice: NaN })),
  };
  assert.ok(issueVisitorTicket(invalidPrice, "verao", visitorSeed, true).error);
});

test("capacidade considera associados e visitantes e impede compra duplicada", () => {
  const state = createInitialState();
  const paid = issueVisitorTicket(state, "verao", visitorSeed, true);
  const repeated = issueVisitorTicket(paid.state, "verao", visitorSeed, true);
  assert.ok(repeated.error);
  assert.equal(repeated.state, paid.state);
  const full = {
    ...state,
    events: state.events.map((event) => ({ ...event, capacity: 1 })),
  };
  assert.ok(issueVisitorTicket(full, "verao", visitorSeed, true).error);
});

test("cada visitante consulta seus ingressos e não aparece na área do associado", () => {
  const state = createInitialState();
  const first = issueVisitorTicket(state, "verao", visitorSeed, true);
  const { profile: other } = createVisitorProfile({
    name: "João Almeida",
    email: "outro@example.com",
  });
  const second = issueVisitorTicket(first.state, "verao", other, true);
  assert.deepEqual(
    visitorTickets(second.state, visitorSeed).map((ticket) => ticket.id),
    [first.ticket.id],
  );
  assert.deepEqual(
    visitorTickets(second.state, other).map((ticket) => ticket.id),
    [second.ticket.id],
  );
  assert.deepEqual(visitorTickets(second.state, null), []);
  assert.deepEqual(
    memberTickets(second.state).map((ticket) => ticket.id),
    [state.tickets[0].id],
  );
  const invited = issueGuestTicket(
    second.state,
    "verao",
    "Convidado da família",
    true,
  );
  assert.ok(
    memberTickets(invited.state).some(
      (ticket) => ticket.id === invited.ticket.id,
    ),
  );
});

test("ingresso de não sócio usa o mesmo QR e controle de reutilização da portaria", () => {
  const paid = issueVisitorTicket(
    createInitialState(),
    "verao",
    visitorSeed,
    true,
  );
  const payload = ticketPayload(paid.ticket);
  const checked = validateTicket(paid.state, payload, "verao");
  assert.equal(checked.result.status, "authorized");
  assert.equal(
    validateTicket(checked.state, payload, "verao").result.status,
    "used",
  );
  const list = prepareOfflineList(
    paid.state,
    "verao",
    null,
    "2026-12-12T16:00:00.000Z",
    "portaria-a",
  ).list;
  assert.equal(
    scanOfflineList(list, payload, "verao").result.status,
    "authorized",
  );
});

test("eventos novos exigem abertura explícita e dados antigos recebem público seguro", () => {
  const state = createInitialState();
  const input = { ...state.events[0], name: "Novo evento" };
  delete input.audience;
  const closed = createEvent(state, input, "novo");
  assert.equal(closed.event.audience, "members");
  const opened = createEvent(state, { ...input, audience: "public" }, "aberto");
  assert.equal(opened.event.audience, "public");
  const legacy = {
    ...closed.state,
    events: closed.state.events.map(({ audience, ...event }) => event),
  };
  const restored = restoreState(JSON.stringify(legacy));
  assert.equal(
    restored.events.find((event) => event.id === "verao").audience,
    "public",
  );
  assert.equal(
    restored.events.find((event) => event.id === "novo").audience,
    "members",
  );
});
