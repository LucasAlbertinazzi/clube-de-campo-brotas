import { useState } from "react";
import { useDemo } from "../lib/DemoContext.jsx";
import { formatDate, formatMoney } from "../lib/model.mjs";
import { Button, DemoNote, Icon, Modal } from "./ui.jsx";
import TicketCard from "./TicketCard.jsx";

export default function ReservationModal({ event, onClose }) {
  const { state, actions, setAppPage } = useDemo();
  const [personId, setPersonId] = useState("marina");
  const [guestName, setGuestName] = useState("João Almeida");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState(false);
  const reserve = (confirmed) => {
    const outcome =
      personId === "guest"
        ? actions.issueGuest(event.id, guestName, confirmed)
        : actions.issue(event.id, personId, confirmed);
    if (outcome.requiresPayment) {
      setPayment(true);
      return;
    }
    if (outcome.error && !outcome.ticket) {
      setError(outcome.error);
      return;
    }
    setResult(outcome.ticket);
    setAppPage("tickets");
  };
  const amount = personId === "guest" ? event.guestPrice : event.memberPrice;
  return (
    <Modal
      title={result ? "Seu ingresso está aqui" : "Participar do evento"}
      onClose={onClose}
    >
      {result ? (
        <>
          <TicketCard
            ticket={
              state.tickets.find((ticket) => ticket.id === result.id) ?? result
            }
            event={event}
            compact
            downloadable
          />
          <DemoNote>
            Ingresso exclusivo desta demonstração. Sem validade para eventos
            reais.
          </DemoNote>
        </>
      ) : (
        <>
          <h3>{event.name}</h3>
          <p className="muted event-modal-meta">
            <Icon name="calendar" size={16} />
            {formatDate(event.date)} · {event.time}
            <br />
            {event.location}
          </p>
          <label className="field">
            Quem vai participar?
            <select
              value={personId}
              onChange={(e) => {
                setPersonId(e.target.value);
                setPayment(false);
                setError("");
              }}
            >
              {state.family.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name} · {person.relationship}
                </option>
              ))}
              <option value="guest">Um convidado</option>
            </select>
          </label>
          {personId === "guest" && (
            <label className="field">
              Nome fictício do convidado
              <input
                value={guestName}
                onChange={(e) => {
                  setGuestName(e.target.value);
                  setPayment(false);
                }}
                maxLength={60}
                minLength={3}
              />
            </label>
          )}
          <div className="reservation-price">
            <span>
              {personId === "guest"
                ? "Ingresso de convidado"
                : "Ingresso de associado"}
            </span>
            <strong>{amount === 0 ? "Gratuito" : formatMoney(amount)}</strong>
          </div>
          {error && (
            <p role="alert" className="field-error">
              {error}
            </p>
          )}
          {payment && (
            <div className="inline-callout">
              Neste exemplo, o ingresso será liberado após simular o pagamento
              de {formatMoney(amount)}.
            </div>
          )}
          <Button
            className="button-full"
            icon="ticket"
            onClick={() => reserve(payment)}
          >
            {payment
              ? "Simular pagamento e emitir ingresso"
              : "Emitir ingresso de demonstração"}
          </Button>
          <DemoNote>
            O ingresso ficará exclusivamente na prévia do aplicativo, fora do
            portal web.
          </DemoNote>
        </>
      )}
    </Modal>
  );
}
