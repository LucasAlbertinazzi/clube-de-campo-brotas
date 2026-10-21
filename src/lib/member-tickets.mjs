import { ticketPayload } from "./model.mjs";

export const MEMBER_TICKETS_KEY = "ccb-member-tickets-demo-v1";
export const emptyMemberWallet = () => ({ version: 1, tickets: [] });

export function saveMemberTicket(
  wallet,
  ticket,
  event,
  now = new Date().toISOString(),
) {
  if (
    !ticket ||
    ticket.status !== "available" ||
    !event ||
    event.status !== "published" ||
    ticket.eventId !== event.id
  ) {
    return {
      wallet,
      error:
        "Somente ingressos liberados de eventos publicados podem ser salvos.",
    };
  }
  const saved = {
    ticket: {
      id: ticket.id,
      eventId: ticket.eventId,
      name: ticket.name,
      category: ticket.category,
      status: ticket.status,
    },
    event: {
      id: event.id,
      name: event.name,
      date: event.date,
      time: event.time,
    },
    payload: ticketPayload(ticket),
    savedAt: now,
  };
  return {
    wallet: {
      version: 1,
      tickets: [
        ...wallet.tickets.filter((item) => item.ticket.id !== ticket.id),
        saved,
      ],
    },
    saved,
  };
}

export function restoreMemberWallet(raw) {
  try {
    const wallet = JSON.parse(raw);
    if (wallet?.version !== 1 || !Array.isArray(wallet.tickets))
      return emptyMemberWallet();
    const ids = new Set();
    for (const saved of wallet.tickets) {
      const { ticket, event } = saved;
      if (
        typeof ticket?.id !== "string" ||
        typeof ticket.eventId !== "string" ||
        typeof ticket.name !== "string" ||
        typeof ticket.category !== "string" ||
        ticket.status !== "available" ||
        typeof event?.name !== "string" ||
        event.id !== ticket.eventId ||
        !/^\d{4}-\d{2}-\d{2}$/.test(event.date) ||
        Number.isNaN(new Date(`${event.date}T12:00:00`).getTime()) ||
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(event.time) ||
        typeof saved.savedAt !== "string" ||
        Number.isNaN(new Date(saved.savedAt).getTime()) ||
        saved.payload !== ticketPayload(ticket) ||
        ids.has(ticket.id)
      )
        return emptyMemberWallet();
      ids.add(ticket.id);
    }
    return wallet;
  } catch {
    return emptyMemberWallet();
  }
}
