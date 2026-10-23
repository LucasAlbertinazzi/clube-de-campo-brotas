export const STORAGE_KEY = "ccb-presentation-demo-v1";
export const DEMO_VERSION = 1;

export const familySeed = [
  {
    id: "marina",
    name: "Marina Costa",
    relationship: "Titular",
    initials: "MC",
    color: "blue",
  },
  {
    id: "rafael",
    name: "Rafael Costa",
    relationship: "Cônjuge",
    initials: "RC",
    color: "green",
  },
  {
    id: "luiza",
    name: "Luiza Costa",
    relationship: "Filha",
    initials: "LC",
    color: "purple",
  },
];

export function createInitialState() {
  return {
    version: DEMO_VERSION,
    family: familySeed.map((person) => ({ ...person })),
    events: [
      {
        id: "verao",
        audience: "public",
        name: "Encontro de Verão",
        date: "2026-12-12",
        time: "18:00",
        location: "Sede social",
        capacity: 150,
        memberPrice: 0,
        guestPrice: 40,
        status: "published",
        category: "Social",
        image: "clube-paisagem.jpeg",
        description:
          "Um encontro para aproveitar o clube com música e boa companhia.",
      },
      {
        id: "familia",
        audience: "public",
        name: "Domingo em Família",
        date: "2026-12-20",
        time: "09:00",
        location: "Área de lazer",
        capacity: 120,
        memberPrice: 0,
        guestPrice: 25,
        status: "published",
        category: "Lazer",
        image: "clube-lago.jpeg",
        description:
          "Uma manhã de convivência, natureza e atividades em família.",
      },
      {
        id: "tenis",
        audience: "members",
        name: "Encontro de Tênis",
        date: "2027-01-17",
        time: "08:00",
        location: "Quadras do clube",
        capacity: 64,
        memberPrice: 25,
        guestPrice: 50,
        status: "published",
        category: "Esporte",
        image: "clube-paisagem.jpeg",
        description:
          "Esporte e integração em uma programação para os associados.",
      },
    ],
    tickets: [
      {
        id: "CCB-DEMO-001",
        eventId: "verao",
        personId: "marina",
        name: "Marina Costa",
        category: "Associada",
        status: "available",
      },
    ],
    bills: [
      {
        id: "dez",
        reference: "Dezembro/2026",
        dueDate: "2026-12-10",
        amount: 320,
        status: "pending",
      },
      {
        id: "nov",
        reference: "Novembro/2026",
        dueDate: "2026-11-10",
        amount: 320,
        status: "paid",
      },
      {
        id: "out",
        reference: "Outubro/2026",
        dueDate: "2026-10-10",
        amount: 320,
        status: "paid",
      },
    ],
    posts: [
      {
        id: "post-1",
        title: "O clube sempre por perto",
        body: "Notícias, eventos e serviços reunidos para facilitar a rotina da família.",
        image: "clube-paisagem.jpeg",
      },
      {
        id: "post-2",
        title: "Um lugar para aproveitar juntos",
        body: "Uma prévia de como as fotos e novidades podem ganhar espaço no novo site.",
        image: "clube-lago.jpeg",
      },
    ],
    messages: [],
    checkins: [],
  };
}

export function restoreState(raw) {
  try {
    const parsed = JSON.parse(raw);
    const arrays = [
      "family",
      "events",
      "tickets",
      "bills",
      "posts",
      "messages",
      "checkins",
    ];
    if (
      parsed?.version !== DEMO_VERSION ||
      arrays.some((key) => !Array.isArray(parsed[key]))
    )
      return createInitialState();
    if (
      !parsed.family.length ||
      parsed.events.some(
        (event) => !event.id || !event.name || !Number.isFinite(event.capacity),
      )
    )
      return createInitialState();
    const defaults = createInitialState().events;
    return {
      ...parsed,
      events: parsed.events.map((event) => ({
        ...event,
        audience:
          event.audience === "public" || event.audience === "members"
            ? event.audience
            : (defaults.find((item) => item.id === event.id)?.audience ??
              "members"),
      })),
    };
  } catch {
    return createInitialState();
  }
}

export const formatMoney = (amount) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    amount,
  );
export const formatDate = (date) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
export const shortDate = (date) =>
  new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short" }).format(
    new Date(`${date}T12:00:00`),
  );
export const ticketPayload = (ticket) =>
  `CCB-DEMO|1|${ticket.eventId}|${ticket.id}`;

export function createEvent(state, input, id = `evento-${Date.now()}`) {
  const event = {
    id,
    name: String(input.name ?? "")
      .trim()
      .slice(0, 80),
    date: input.date,
    time: input.time,
    location: String(input.location ?? "")
      .trim()
      .slice(0, 80),
    capacity: Number(input.capacity),
    memberPrice: Number(input.memberPrice),
    guestPrice: Number(input.guestPrice),
    audience: input.audience === "public" ? "public" : "members",
    status: input.status === "draft" ? "draft" : "published",
    category: "Social",
    image: "clube-paisagem.jpeg",
    description: "Evento criado nesta demonstração.",
  };
  const parsedDate = new Date(`${event.date}T12:00:00Z`);
  const validDate =
    /^\d{4}-\d{2}-\d{2}$/.test(event.date ?? "") &&
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === event.date;
  const validTime = /^([01]\d|2[0-3]):[0-5]\d$/.test(event.time ?? "");
  if (
    !event.name ||
    !event.location ||
    !validDate ||
    !validTime ||
    !Number.isInteger(event.capacity) ||
    event.capacity < 1 ||
    event.capacity > 10000 ||
    !Number.isFinite(event.memberPrice) ||
    event.memberPrice < 0 ||
    !Number.isFinite(event.guestPrice) ||
    event.guestPrice < 0
  ) {
    return {
      state,
      error:
        "Confira nome, data, horário, local, capacidade e valores do evento.",
    };
  }
  if (state.events.some((item) => item.id === id))
    return { state, error: "Este identificador de evento já existe." };
  return { state: { ...state, events: [event, ...state.events] }, event };
}

export function reserveTicket(
  state,
  event,
  person,
  paymentConfirmed,
  amount,
  category,
) {
  if (!event || event.status !== "published" || !person)
    return {
      state,
      error: "Selecione um evento publicado e um integrante da família.",
    };
  const existing = state.tickets.find(
    (ticket) =>
      ticket.eventId === event.id &&
      ticket.personId === person.id &&
      ticket.status !== "cancelled",
  );
  if (existing)
    return {
      state,
      error: "Esta pessoa já tem um ingresso para o evento.",
      ticket: existing,
    };
  const reserved = state.tickets.filter(
    (ticket) => ticket.eventId === event.id && ticket.status !== "cancelled",
  ).length;
  if (reserved >= event.capacity)
    return {
      state,
      error: "Este evento atingiu a capacidade de participantes.",
    };
  if (amount > 0 && !paymentConfirmed)
    return { state, requiresPayment: true, amount };
  let sequence = state.tickets.length + 1;
  while (
    state.tickets.some(
      (ticket) => ticket.id === `CCB-DEMO-${String(sequence).padStart(3, "0")}`,
    )
  )
    sequence += 1;
  const ticket = {
    id: `CCB-DEMO-${String(sequence).padStart(3, "0")}`,
    eventId: event.id,
    personId: person.id,
    name: person.name,
    category,
    amount,
    status: "available",
  };
  return { state: { ...state, tickets: [...state.tickets, ticket] }, ticket };
}

export function issueTicket(
  state,
  eventId,
  personId,
  paymentConfirmed = false,
) {
  const event = state.events.find((item) => item.id === eventId);
  const person = state.family.find((item) => item.id === personId);
  return reserveTicket(
    state,
    event,
    person,
    paymentConfirmed,
    event?.memberPrice ?? 0,
    person?.relationship === "Titular" ? "Associada" : "Dependente",
  );
}

export function issueGuestTicket(
  state,
  eventId,
  name,
  paymentConfirmed = false,
) {
  const clean = String(name ?? "")
    .trim()
    .slice(0, 60);
  if (clean.length < 3)
    return { state, error: "Informe um nome fictício para o convidado." };
  const event = state.events.find((item) => item.id === eventId);
  const person = {
    id: `guest-${clean.toLocaleLowerCase("pt-BR")}`,
    name: clean,
  };
  return reserveTicket(
    state,
    event,
    person,
    paymentConfirmed,
    event?.guestPrice ?? 0,
    "Convidado",
  );
}

export function validateTicket(
  state,
  rawCode,
  eventId,
  now = new Date().toISOString(),
) {
  const code = String(rawCode ?? "").trim();
  let ticketId = code;
  if (code.startsWith("CCB-DEMO|")) {
    const parts = code.split("|");
    if (parts.length !== 4 || parts[1] !== "1")
      return {
        state,
        result: {
          status: "invalid",
          title: "Ingresso inválido",
          detail: "O código não pertence a esta demonstração.",
        },
      };
    ticketId = parts[3];
    const recorded = state.tickets.find((ticket) => ticket.id === ticketId);
    if (recorded?.eventId !== parts[2])
      return {
        state,
        result: {
          status: "invalid",
          title: "Ingresso inválido",
          detail: "Os dados do código não conferem.",
        },
      };
  }
  const ticket = state.tickets.find((item) => item.id === ticketId);
  if (!ticket)
    return {
      state,
      result: {
        status: "invalid",
        title: "Ingresso inválido",
        detail: "Código não encontrado. Confira o ingresso apresentado.",
      },
    };
  if (ticket.eventId !== eventId)
    return {
      state,
      result: {
        status: "invalid",
        title: "Ingresso de outro evento",
        detail: "Selecione o evento correspondente para validar a entrada.",
        ticket,
      },
    };
  if (ticket.status === "cancelled")
    return {
      state,
      result: {
        status: "invalid",
        title: "Ingresso cancelado",
        detail: "Este ingresso não está disponível para entrada.",
        ticket,
      },
    };
  if (ticket.status === "used")
    return {
      state,
      result: {
        status: "used",
        title: "Ingresso já utilizado",
        detail: "A entrada deste ingresso já foi registrada.",
        ticket,
      },
    };
  if (ticket.status !== "available")
    return {
      state,
      result: {
        status: "invalid",
        title: "Ingresso não liberado",
        detail: "O ingresso ainda não está disponível para entrada.",
        ticket,
      },
    };
  const checkin = {
    ticketId,
    eventId,
    name: ticket.name,
    at: now,
    operator: "Portaria de demonstração",
  };
  return {
    state: {
      ...state,
      tickets: state.tickets.map((item) =>
        item.id === ticketId ? { ...item, status: "used" } : item,
      ),
      checkins: [checkin, ...state.checkins],
    },
    result: {
      status: "authorized",
      title: "Entrada autorizada",
      detail: "Entrada registrada nesta demonstração.",
      ticket,
    },
  };
}

export function confirmBill(state, billId) {
  if (
    !state.bills.some((bill) => bill.id === billId && bill.status === "pending")
  )
    return state;
  return {
    ...state,
    bills: state.bills.map((bill) =>
      bill.id === billId ? { ...bill, status: "paid" } : bill,
    ),
  };
}
