import { validateTicket } from "./model.mjs";

export const OFFLINE_STORAGE_KEY = "ccb-offline-gate-demo-v1";

export function prepareOfflineList(
  state,
  eventId,
  previous,
  now = new Date().toISOString(),
  id = crypto.randomUUID(),
) {
  if (previous?.entries.some((entry) => entry.status === "pending")) {
    return {
      list: previous,
      error: "Sincronize as entradas pendentes antes de baixar outra lista.",
    };
  }
  const event = state.events.find(
    (item) => item.id === eventId && item.status === "published",
  );
  if (!event)
    return {
      list: previous ?? null,
      error: "Selecione um evento publicado para preparar a lista.",
    };
  return {
    list: {
      version: 1,
      id,
      downloadedAt: now,
      event: { id: event.id, name: event.name },
      tickets: state.tickets
        .filter((ticket) => ticket.eventId === eventId)
        .map(({ id: ticketId, eventId: ticketEvent, name, status }) => ({
          id: ticketId,
          eventId: ticketEvent,
          name,
          status,
        })),
      entries: [],
    },
  };
}

export function restoreOfflineList(raw) {
  try {
    const list = JSON.parse(raw);
    if (
      list?.version !== 1 ||
      typeof list.id !== "string" ||
      typeof list.downloadedAt !== "string" ||
      typeof list.event?.id !== "string" ||
      typeof list.event?.name !== "string" ||
      !Array.isArray(list.tickets) ||
      !Array.isArray(list.entries)
    )
      return null;
    if (
      list.tickets.some(
        (ticket) =>
          typeof ticket.id !== "string" ||
          typeof ticket.name !== "string" ||
          typeof ticket.status !== "string" ||
          ticket.eventId !== list.event.id,
      )
    )
      return null;
    if (
      list.entries.some(
        (entry) =>
          typeof entry.id !== "string" ||
          typeof entry.ticketId !== "string" ||
          typeof entry.at !== "string" ||
          entry.eventId !== list.event.id ||
          !["pending", "synced", "conflict"].includes(entry.status),
      )
    )
      return null;
    return list;
  } catch {
    return null;
  }
}

export function scanOfflineList(
  list,
  code,
  eventId,
  now = new Date().toISOString(),
) {
  if (!list || list.event.id !== eventId)
    return {
      list,
      result: {
        status: "invalid",
        title: "Lista offline indisponível",
        detail:
          "Baixe a lista deste evento antes de simular a leitura sem internet.",
      },
    };
  const checked = validateTicket(
    { tickets: list.tickets, checkins: [] },
    code,
    eventId,
    now,
  );
  if (checked.result.status !== "authorized")
    return {
      list,
      result: {
        ...checked.result,
        detail: `${checked.result.detail} A consulta usa somente a lista baixada.`,
      },
    };
  const entry = {
    id: `${list.id}:${checked.result.ticket.id}`,
    ticketId: checked.result.ticket.id,
    eventId,
    name: checked.result.ticket.name,
    at: now,
    status: "pending",
  };
  return {
    list: {
      ...list,
      tickets: checked.state.tickets,
      entries: [...list.entries, entry],
    },
    result: {
      ...checked.result,
      title: "Entrada autorizada offline",
      detail: "Entrada salva neste aparelho. Aguardando sincronização.",
    },
  };
}

export function syncOfflineList(state, list) {
  if (!list) return { state, list, synced: 0, conflicts: 0 };
  let next = state;
  let synced = 0;
  const entries = list.entries.map((entry) => {
    if (entry.status !== "pending") return entry;
    if (next.checkins.some((checkin) => checkin.offlineId === entry.id)) {
      synced += 1;
      return { ...entry, status: "synced" };
    }
    const published = next.events.some(
      (event) => event.id === list.event.id && event.status === "published",
    );
    const checked = published
      ? validateTicket(next, entry.ticketId, entry.eventId, entry.at)
      : null;
    if (!checked || checked.result.status !== "authorized")
      return {
        ...entry,
        status: "conflict",
        reason: checked?.result.title ?? "Evento indisponível",
      };
    next = {
      ...checked.state,
      checkins: checked.state.checkins.map((checkin, index) =>
        index === 0
          ? {
              ...checkin,
              offlineId: entry.id,
              operator: "Portaria offline de demonstração",
            }
          : checkin,
      ),
    };
    synced += 1;
    return { ...entry, status: "synced" };
  });
  return {
    state: next,
    list: { ...list, entries },
    synced,
    conflicts: entries.filter((entry) => entry.status === "conflict").length,
  };
}
