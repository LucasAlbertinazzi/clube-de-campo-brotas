import { useState } from "react";
import { useDemo } from "../lib/DemoContext.jsx";
import { formatDate, formatMoney } from "../lib/model.mjs";
import { Button, DemoNote, Icon, Modal } from "./ui.jsx";
import TicketCard from "./TicketCard.jsx";

export default function VisitorCheckout({ event, onClose, onPurchased }) {
  const { state, visitorSession, actions } = useDemo();
  const [payment, setPayment] = useState(false);
  const [method, setMethod] = useState("Pix");
  const [ticketId, setTicketId] = useState(null);
  const [error, setError] = useState("");
  const ticket = state.tickets.find((item) => item.id === ticketId);
  const buy = () => {
    const result = actions.buyVisitorTicket(event.id, payment);
    if (result.requiresPayment) {
      setPayment(true);
      return;
    }
    if (result.error) {
      setError(result.error);
      return;
    }
    setTicketId(result.ticket.id);
  };
  return (
    <Modal
      title={
        ticket ? "Ingresso do não sócio" : "Compra de ingresso · Não sócio"
      }
      onClose={onClose}
    >
      {ticket ? (
        <>
          <div className="inline-success">
            <Icon name="success" size={19} />
            Pagamento simulado. Ingresso liberado.
          </div>
          <TicketCard ticket={ticket} event={event} compact downloadable />
          <Button className="button-full visitor-confirm" onClick={onPurchased}>
            Ver meus ingressos
          </Button>
        </>
      ) : (
        <>
          <h3>{event.name}</h3>
          <p className="muted event-modal-meta">
            {formatDate(event.date)} · {event.time}
            <br />
            {event.location}
          </p>
          <p className="visitor-buyer">
            <Icon name="users" size={18} />
            <span>
              Comprador: <strong>{visitorSession?.name}</strong>
              <br />
              Conta de não sócio · sem vínculo com titular
            </span>
          </p>
          <div className="reservation-price">
            <span>Ingresso de não sócio</span>
            <strong>{formatMoney(event.guestPrice)}</strong>
          </div>
          {payment && (
            <label className="field">
              Forma de pagamento simulada
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option>Pix</option>
                <option>Cartão</option>
                <option>Boleto</option>
              </select>
            </label>
          )}
          {error && (
            <p role="alert" className="field-error">
              {error}
            </p>
          )}
          <Button className="button-full" icon="ticket" onClick={buy}>
            {payment
              ? `Simular ${method} e emitir ingresso`
              : "Continuar compra"}
          </Button>
        </>
      )}
      <DemoNote>
        Somente dados fictícios. Nenhum pagamento ou autenticação real é
        realizado. O QR Code serve apenas para testar a portaria desta
        apresentação.
      </DemoNote>
    </Modal>
  );
}
