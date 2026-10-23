import { useState } from "react";
import { useDemo } from "../lib/DemoContext.jsx";
import { formatDate, formatMoney } from "../lib/model.mjs";
import {
  publicEvents,
  visitorTickets,
  VISITOR_DEMO_CODE,
} from "../lib/visitors.mjs";
import { Button, DemoNote, Icon, Tabs } from "./ui.jsx";
import TicketCard from "./TicketCard.jsx";
import VisitorCheckout from "./VisitorCheckout.jsx";
import "./visitors.css";

const navigation = [
  { id: "events", label: "Eventos", icon: "calendar" },
  { id: "tickets", label: "Meus ingressos", icon: "ticket" },
  { id: "purchases", label: "Minhas compras", icon: "card" },
];

export default function VisitorPanel({ compact = false }) {
  const {
    state,
    actions,
    visitorProfile,
    visitorSession,
    visitorEventId,
    setVisitorEventId,
  } = useDemo();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("João Almeida");
  const [email, setEmail] = useState(visitorProfile.email);
  const [code, setCode] = useState(VISITOR_DEMO_CODE);
  const [error, setError] = useState("");
  const [page, setPage] = useState("events");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const events = publicEvents(state);
  const tickets = visitorTickets(state, visitorSession);
  const intent = events.find((event) => event.id === visitorEventId);
  const submit = (event) => {
    event.preventDefault();
    const result =
      mode === "login"
        ? actions.signInVisitor(email, code)
        : actions.registerVisitor({ name, email });
    if (result.error) {
      setError(result.error);
      return;
    }
    setError("");
    setPage("events");
  };
  return (
    <section
      className={`visitor-panel${compact ? " visitor-panel-compact" : ""}`}
      aria-label={compact ? "Aplicativo do não sócio" : "Área do não sócio"}
    >
      <div className="visitor-heading">
        <div>
          <span className="visitor-label">NÃO SÓCIO · EVENTOS ABERTOS</span>
          <h3>
            {visitorSession
              ? `Olá, ${visitorSession.name.split(" ")[0]}`
              : "Seu ingresso começa aqui."}
          </h3>
        </div>
        {visitorSession && (
          <button
            type="button"
            className="text-button"
            onClick={() => {
              actions.signOutVisitor();
              setSelectedEvent(null);
            }}
          >
            Sair
          </button>
        )}
      </div>
      {!visitorSession ? (
        <div className="visitor-access-grid">
          <form className="visitor-auth" onSubmit={submit}>
            <Tabs
              items={[
                { id: "login", label: "Entrar" },
                { id: "register", label: "Criar cadastro" },
              ]}
              value={mode}
              onChange={(value) => {
                setMode(value);
                setError("");
              }}
              label={
                compact ? "Acesso não sócio no app" : "Acesso não sócio no site"
              }
            />
            <p>
              Experimente com dados fictícios. Não é necessário ser associado ou
              ter convite de um titular.
            </p>
            {mode === "register" && (
              <label className="field">
                Nome fictício
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  minLength={3}
                  maxLength={60}
                  required
                  autoComplete="off"
                />
              </label>
            )}
            <label className="field">
              E-mail fictício (example.com)
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={76}
                required
                autoComplete="off"
              />
            </label>
            {mode === "login" && (
              <label className="field">
                Código de demonstração
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  required
                  inputMode="numeric"
                  autoComplete="off"
                />
              </label>
            )}
            {mode === "login" && (
              <p className="field-hint">
                Acesso fictício: {visitorProfile.email} · código 123456.
              </p>
            )}
            {error && (
              <p className="field-error" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" className="button-full">
              {mode === "login"
                ? "Simular login de não sócio"
                : "Criar cadastro de demonstração"}
            </Button>
          </form>
          <div className="visitor-access-copy">
            <Icon name="ticket" size={34} />
            <h4>Compra direta, acesso próprio.</h4>
            <p>
              Escolha um evento aberto, simule o pagamento e receba seu ingresso
              com QR Code na sua conta.
            </p>
            <ul>
              <li>Eventos e valores definidos pelo clube.</li>
              <li>Histórico de compras e ingressos próprios.</li>
              <li>
                Associados mantêm uma área exclusiva para família, mensalidades
                e benefícios.
              </li>
            </ul>
            {intent && (
              <p className="visitor-intent">
                <strong>Continue sua compra:</strong> {intent.name} ·{" "}
                {formatMoney(intent.guestPrice)}.
              </p>
            )}
          </div>
        </div>
      ) : (
        <>
          <p className="visitor-profile-note">
            <Icon name="shield" size={17} />
            Perfil não sócio: eventos, compras e seus ingressos.
          </p>
          <Tabs
            items={navigation}
            value={page}
            onChange={setPage}
            label={compact ? "Menu não sócio no app" : "Menu não sócio no site"}
            className="visitor-navigation"
          />
          {page === "events" && (
            <div className="visitor-events">
              {intent && (
                <p className="visitor-intent">
                  Evento selecionado: <strong>{intent.name}</strong>
                </p>
              )}
              {events.map((event) => (
                <article className="visitor-event" key={event.id}>
                  <span className="visitor-label">ABERTO A NÃO SÓCIOS</span>
                  <h4>{event.name}</h4>
                  <p>
                    {formatDate(event.date)} · {event.time}
                    <br />
                    {event.location}
                  </p>
                  <div>
                    <strong>{formatMoney(event.guestPrice)}</strong>
                    <Button
                      icon="ticket"
                      onClick={() => setSelectedEvent(event)}
                    >
                      Comprar ingresso
                    </Button>
                  </div>
                </article>
              ))}
              {!events.length && (
                <p className="visitor-empty">
                  Nenhum evento aberto ao público neste momento.
                </p>
              )}
            </div>
          )}
          {page === "tickets" && (
            <div className="visitor-ticket-list">
              {tickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  event={state.events.find(
                    (event) => event.id === ticket.eventId,
                  )}
                  compact
                  downloadable
                />
              ))}
              {!tickets.length && (
                <p className="visitor-empty">
                  Seus ingressos aparecerão aqui após a compra. Explore os
                  eventos abertos.
                </p>
              )}
            </div>
          )}
          {page === "purchases" && (
            <div className="visitor-purchases">
              <h4>Compras desta conta</h4>
              {tickets.map((ticket) => (
                <article key={ticket.id}>
                  <Icon name="ticket" size={22} />
                  <div>
                    <strong>
                      {
                        state.events.find(
                          (event) => event.id === ticket.eventId,
                        )?.name
                      }
                    </strong>
                    <p>
                      {ticket.id} ·{" "}
                      {ticket.status === "cancelled"
                        ? "Cancelado"
                        : "Pagamento simulado confirmado"}
                    </p>
                  </div>
                  <strong>{formatMoney(ticket.amount)}</strong>
                </article>
              ))}
              {!tickets.length && (
                <p className="visitor-empty">
                  Nenhuma compra nesta conta de demonstração.
                </p>
              )}
            </div>
          )}
        </>
      )}
      <DemoNote>
        Prévia sem autenticação real. Dados fictícios e pagamentos simulados. Na
        produção, as permissões serão validadas pelo servidor.
      </DemoNote>
      {visitorSession && selectedEvent && (
        <VisitorCheckout
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onPurchased={() => {
            setPage("tickets");
            setSelectedEvent(null);
            setVisitorEventId(null);
          }}
        />
      )}
    </section>
  );
}
