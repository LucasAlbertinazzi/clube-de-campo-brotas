import { useState } from "react";
import { useDemo } from "../lib/DemoContext.jsx";
import { formatDate, formatMoney, shortDate } from "../lib/model.mjs";
import {
  Avatar,
  Brand,
  Button,
  Icon,
  Modal,
  PhoneFrame,
  Status,
  asset,
} from "./ui.jsx";
import TicketCard from "./TicketCard.jsx";
import PaymentModal from "./PaymentModal.jsx";
import ReservationModal from "./ReservationModal.jsx";
import { FamilyView } from "./MemberPanel.jsx";

export const appNavigation = [
  { id: "home", label: "Início", icon: "home" },
  { id: "bills", label: "Cobranças", icon: "file" },
  { id: "tickets", label: "Ingressos", icon: "ticket" },
  { id: "family", label: "Minha família", icon: "users" },
];

export default function MobileApp() {
  const { state, appPage, setAppPage } = useDemo();
  const [bill, setBill] = useState(null);
  const [event, setEvent] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState("CCB-DEMO-001");
  const [notices, setNotices] = useState(false);
  const ticket =
    state.tickets.find((item) => item.id === selectedTicket) ??
    state.tickets[0];
  const eventForTicket = state.events.find(
    (item) => item.id === ticket?.eventId,
  );
  return (
    <>
      <PhoneFrame
        className="showcase-phone"
        label="Aplicativo navegável do associado"
      >
        <div className="app-brand-row">
          <Brand compact />
          <button
            type="button"
            className="icon-button"
            aria-label="Ver comunicados no aplicativo"
            onClick={() => setNotices(true)}
          >
            <Icon name="bell" size={20} />
          </button>
        </div>
        <div className="app-body" key={appPage}>
          {appPage === "home" && (
            <>
              <h3>Olá, {state.family[0].name.split(" ")[0]}</h3>
              <p className="app-subtitle">Que bom ver você por aqui!</p>
              <img
                className="app-home-photo"
                src={asset("clube-paisagem.jpeg")}
                alt="Lago do clube"
                loading="lazy"
              />
              <div className="app-section-title">
                <h4>Próximos encontros</h4>
                <Icon name="calendar" size={17} />
              </div>
              {state.events
                .filter((item) => item.status === "published")
                .map((item) => (
                  <button
                    type="button"
                    className="app-event"
                    key={item.id}
                    onClick={() => setEvent(item)}
                  >
                    <span className="app-date">{shortDate(item.date)}</span>
                    <span>
                      <strong>{item.name}</strong>
                      <small>
                        {item.location} · {item.time}
                      </small>
                    </span>
                    <Icon name="next" size={16} />
                  </button>
                ))}
              <div className="app-quick-links">
                <button type="button" onClick={() => setAppPage("bills")}>
                  <Icon name="card" />
                  Cobranças
                </button>
                <button type="button" onClick={() => setAppPage("family")}>
                  <Icon name="users" />
                  Minha família
                </button>
              </div>
            </>
          )}
          {appPage === "bills" && (
            <>
              <h3>Cobranças</h3>
              <p className="app-subtitle">Suas mensalidades, com clareza.</p>
              {state.bills.map((item) => (
                <div className="app-bill" key={item.id}>
                  <div>
                    <strong>{item.reference}</strong>
                    <small>Vence em {formatDate(item.dueDate)}</small>
                  </div>
                  <strong>{formatMoney(item.amount)}</strong>
                  <div>
                    <Status tone={item.status === "paid" ? "green" : "amber"}>
                      {item.status === "paid" ? "Pago" : "Em aberto"}
                    </Status>
                    {item.status === "pending" && (
                      <button
                        type="button"
                        className="text-button"
                        onClick={() => setBill(item)}
                      >
                        Ver pagamento
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <p className="app-disclosure">
                Pagamentos apenas simulados nesta prévia.
              </p>
            </>
          )}
          {appPage === "tickets" && (
            <>
              <h3>Meus ingressos</h3>
              {state.tickets.length > 1 && (
                <label className="sr-label">
                  Escolha o ingresso
                  <select
                    className="ticket-select"
                    value={ticket.id}
                    onChange={(e) => setSelectedTicket(e.target.value)}
                    aria-label="Escolher ingresso no aplicativo"
                  >
                    {state.tickets.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.name} ·{" "}
                        {
                          state.events.find((evt) => evt.id === item.eventId)
                            ?.name
                        }
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <TicketCard ticket={ticket} event={eventForTicket} compact />
              <button
                type="button"
                className="text-button app-agenda-link"
                onClick={() => setAppPage("home")}
              >
                Explorar a agenda
                <Icon name="arrow" size={15} />
              </button>
            </>
          )}
          {appPage === "family" && (
            <>
              <h3>Minha família</h3>
              <p className="app-subtitle">Título familiar 00124</p>
              <FamilyView compact />
              <div className="app-profile-note">
                <Icon name="shield" />
                <p>
                  Uma família, um vínculo.
                  <br />
                  Cada pessoa com sua identificação.
                </p>
              </div>
            </>
          )}
        </div>
        <nav className="app-bottom-nav" aria-label="Navegação do aplicativo">
          {appNavigation.map((item) => (
            <button
              type="button"
              key={item.id}
              aria-current={appPage === item.id ? "page" : undefined}
              className={appPage === item.id ? "is-active" : ""}
              onClick={() => setAppPage(item.id)}
            >
              <Icon name={item.icon} size={21} />
              <span>{item.id === "family" ? "Perfil" : item.label}</span>
            </button>
          ))}
        </nav>
      </PhoneFrame>
      {bill && <PaymentModal bill={bill} onClose={() => setBill(null)} />}
      {event && (
        <ReservationModal event={event} onClose={() => setEvent(null)} />
      )}
      {notices && (
        <Modal title="Comunicados do clube" onClose={() => setNotices(false)}>
          <div className="notice-list">
            {state.posts.map((post) => (
              <article key={post.id}>
                <Icon name="news" />
                <div>
                  <h4>{post.title}</h4>
                  <p>{post.body}</p>
                </div>
              </article>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}

export function MiniPhone() {
  const { state, setAppPage } = useDemo();
  return (
    <PhoneFrame className="hero-phone" label="Prévia do aplicativo no celular">
      <div className="mini-brand-row">
        <Brand compact />
        <Icon name="bell" size={14} />
      </div>
      <div className="mini-phone-content">
        <h3>Olá, {state.family[0].name.split(" ")[0]}</h3>
        <p>Que bom ver você por aqui!</p>
        <img
          src={asset("clube-paisagem.jpeg")}
          alt="Lago do clube na prévia do aplicativo"
        />
        <div className="mini-event">
          <span>
            12<small>DEZ</small>
          </span>
          <div>
            <strong>Encontro de Verão</strong>
            <small>Música e boa companhia.</small>
          </div>
        </div>
        <h4>Acesso rápido</h4>
        <div className="mini-shortcuts">
          {[
            { id: "tickets", label: "Ingressos", icon: "ticket" },
            { id: "family", label: "Família", icon: "users" },
            { id: "bills", label: "Cobranças", icon: "card" },
          ].map((item) => (
            <a
              href="#aplicativo"
              key={item.id}
              onClick={() => setAppPage(item.id)}
            >
              <Icon name={item.icon} size={17} />
              <span>{item.label}</span>
            </a>
          ))}
        </div>
        <div className="mini-family">
          <Avatar person={state.family[0]} size="small" />
          <span>Um acesso para a família</span>
        </div>
      </div>
    </PhoneFrame>
  );
}
