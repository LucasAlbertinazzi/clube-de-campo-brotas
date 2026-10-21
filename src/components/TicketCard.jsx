import QrCode, { downloadQr } from "./QrCode.jsx";
import { Button, Icon, Status, asset } from "./ui.jsx";
import { formatDate, ticketPayload } from "../lib/model.mjs";

export default function TicketCard({
  ticket,
  event,
  compact = false,
  downloadable = false,
}) {
  if (!ticket || !event)
    return (
      <div className="empty-state">
        <Icon name="ticket" size={32} />
        <p>Escolha um evento para emitir seu ingresso.</p>
      </div>
    );
  return (
    <article className={`ticket-card ${compact ? "ticket-compact" : ""}`}>
      <img
        className="ticket-cover"
        src={asset(event.image)}
        alt="Paisagem do Clube de Campo de Brotas"
        loading="lazy"
      />
      <div className="ticket-card-body">
        <p className="ticket-event-name">{event.name}</p>
        <p className="ticket-meta">
          <Icon name="calendar" size={14} />
          {formatDate(event.date)}
          <span>·</span>
          {event.time}
        </p>
        <div className="ticket-perforation" />
        <div className="ticket-person">
          <span>{ticket.name}</span>
          <small>{ticket.category}</small>
        </div>
        <QrCode
          value={ticketPayload(ticket)}
          label={`QR demonstrativo do ingresso ${ticket.id}`}
        />
        <span className="ticket-code">{ticket.id}</span>
        <Status
          tone={
            ticket.status === "used"
              ? "amber"
              : ticket.status === "cancelled"
                ? "red"
                : "green"
          }
        >
          {ticket.status === "used"
            ? "Entrada já registrada"
            : ticket.status === "cancelled"
              ? "Ingresso cancelado"
              : "Disponível para entrada"}
        </Status>
        {downloadable && (
          <Button
            variant="secondary"
            icon="download"
            onClick={() => downloadQr(ticketPayload(ticket), ticket.id)}
          >
            Baixar QR demonstrativo
          </Button>
        )}
      </div>
    </article>
  );
}
