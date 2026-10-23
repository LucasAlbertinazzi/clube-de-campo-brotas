import { reserveTicket } from "./model.mjs";

// Identidade fictícia e código público exclusivos da apresentação, sem autenticação real.
export const VISITOR_DEMO_CODE = "123456";
export const visitorSeed = Object.freeze({
  id: "visitor-joao@example.com",
  name: "João Almeida",
  email: "joao@example.com",
  role: "visitor",
});

export function createVisitorProfile(input) {
  const name = String(input?.name ?? "")
    .trim()
    .slice(0, 60);
  const email = String(input?.email ?? "")
    .trim()
    .toLowerCase();
  if (name.length < 3 || !/^[a-z0-9._+-]{1,64}@example\.com$/.test(email)) {
    return {
      error:
        "Use um nome fictício e um e-mail de exemplo, como joao@example.com.",
    };
  }
  return { profile: { id: `visitor-${email}`, name, email, role: "visitor" } };
}

export function signInVisitor(profile, email, code) {
  if (
    profile?.role !== "visitor" ||
    String(email).trim().toLowerCase() !== profile.email ||
    code !== VISITOR_DEMO_CODE
  ) {
    return {
      error: "Confira o e-mail fictício e o código de demonstração 123456.",
    };
  }
  return { profile };
}

export const publicEvents = (state) =>
  state.events.filter(
    (event) => event.status === "published" && event.audience === "public",
  );

export const visitorTickets = (state, profile) =>
  profile?.role === "visitor"
    ? state.tickets.filter(
        (ticket) =>
          ticket.personId === profile.id && ticket.category === "Não sócio",
      )
    : [];

export const memberTickets = (state) =>
  state.tickets.filter(
    (ticket) =>
      state.family.some((person) => person.id === ticket.personId) ||
      ticket.category === "Convidado",
  );

export function issueVisitorTicket(
  state,
  eventId,
  profile,
  paymentConfirmed = false,
) {
  if (profile?.role !== "visitor" || !profile.id || !profile.name) {
    return {
      state,
      error: "Entre na área de não sócios para comprar seu ingresso.",
    };
  }
  const event = publicEvents(state).find((item) => item.id === eventId);
  if (!event) {
    return {
      state,
      error: "Este evento não está aberto à compra por não sócios.",
    };
  }
  if (!Number.isFinite(event.guestPrice) || event.guestPrice < 0) {
    return {
      state,
      error: "O preço de não sócio precisa ser conferido pelo clube.",
    };
  }
  return reserveTicket(
    state,
    event,
    profile,
    paymentConfirmed,
    event.guestPrice,
    "Não sócio",
  );
}
