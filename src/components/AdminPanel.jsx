import { useState } from "react";
import { useDemo } from "../lib/DemoContext.jsx";
import { formatDate } from "../lib/model.mjs";
import { Avatar, Brand, Button, DemoNote, Icon, Modal, Status } from "./ui.jsx";
import EventForm from "./EventForm.jsx";
import { allowsCapability } from "../lib/packages.mjs";

const navigation = [
  { id: "overview", label: "Visão geral", icon: "dashboard" },
  { id: "members", label: "Associados", icon: "users" },
  { id: "events", label: "Eventos", icon: "calendar" },
  { id: "posts", label: "Publicações", icon: "news" },
  { id: "support", label: "Atendimento", icon: "support" },
  { id: "gate", label: "Portaria", icon: "scan" },
];

export default function AdminPanel() {
  const { state, actions, adminPage, setAdminPage, demoPackage } = useDemo();
  const ticketing = allowsCapability("ticketManagement", {
    includeMobile: demoPackage === "combined",
    channel: "admin",
  });
  const visibleNavigation = navigation.filter(
    (item) => item.id !== "gate" || ticketing,
  );
  const page = visibleNavigation.some((item) => item.id === adminPage)
    ? adminPage
    : "events";
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [postTitle, setPostTitle] = useState("Programação do fim de semana");
  const [postBody, setPostBody] = useState(
    "Confira os próximos encontros e aproveite bons momentos em família.",
  );
  const current =
    visibleNavigation.find((item) => item.id === page) ?? navigation[0];
  const members = state.family.filter((person) =>
    person.name
      .toLocaleLowerCase("pt-BR")
      .includes(query.toLocaleLowerCase("pt-BR")),
  );
  return (
    <div className="product-shell">
      <aside className="product-sidebar">
        <Brand compact />
        <nav aria-label="Menu da administração">
          {visibleNavigation.map((item) => (
            <button
              type="button"
              className={page === item.id ? "is-active" : ""}
              key={item.id}
              onClick={() => setAdminPage(item.id)}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <Icon name="shield" size={16} />
          <span>Perfil administrativo</span>
        </div>
      </aside>
      <div className="product-main">
        <div className="product-topbar">
          <span>Painel do clube</span>
          <span className="profile-inline">
            <span className="avatar avatar-small">AD</span>
            <span>
              Administrador<small>Dados de demonstração</small>
            </span>
          </span>
        </div>
        <div className="product-content">
          <div className="product-title product-title-action">
            <div>
              <h3>{current.label}</h3>
              <p>
                {
                  {
                    overview: "Uma visão conectada dos dados desta prévia.",
                    events: ticketing
                      ? "Pacote app: configure ingressos no painel. Compras exclusivamente no aplicativo."
                      : "Agenda informativa do pacote web. Sem venda ou emissão de ingressos.",
                    members:
                      "Titulares e dependentes no mesmo cadastro familiar.",
                    posts:
                      "As novidades publicadas aparecem na prévia do site.",
                    support: "Solicitações enviadas na área do associado.",
                    gate: "Acompanhe as entradas registradas nesta prévia.",
                  }[page]
                }
              </p>
            </div>
            {page === "events" && (
              <Button
                className="small-button"
                icon="plus"
                onClick={() => setCreating(true)}
              >
                Novo evento
              </Button>
            )}
          </div>
          {page === "overview" && (
            <>
              <div className="summary-row">
                <div className="summary-box">
                  <Icon name="calendar" />
                  <span>
                    Eventos publicados
                    <strong>
                      {
                        state.events.filter(
                          (item) => item.status === "published",
                        ).length
                      }
                    </strong>
                  </span>
                </div>
                {ticketing && (
                  <>
                    <div className="summary-box">
                      <Icon name="ticket" />
                      <span>
                        Ingressos emitidos
                        <strong>{state.tickets.length}</strong>
                      </span>
                    </div>
                    <div className="summary-box">
                      <Icon name="scan" />
                      <span>
                        Entradas registradas
                        <strong>{state.checkins.length}</strong>
                      </span>
                    </div>{" "}
                  </>
                )}
              </div>
              <div className="admin-overview-actions">
                <button type="button" onClick={() => setAdminPage("events")}>
                  <Icon name="calendar" />
                  <strong>Organizar eventos</strong>
                  <Icon name="next" />
                </button>
                <button type="button" onClick={() => setAdminPage("posts")}>
                  <Icon name="news" />
                  <strong>Publicar uma novidade</strong>
                  <Icon name="next" />
                </button>
              </div>
              <DemoNote>
                Os indicadores acompanham somente as ações desta demonstração.
              </DemoNote>
            </>
          )}
          {page === "events" && (
            <>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Evento</th>
                      <th>Data</th>
                      {ticketing && <th>Inscritos</th>}
                      <th>Situação</th>
                      <th>
                        <span className="sr-only">Ações</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.events.map((event) => (
                      <tr key={event.id}>
                        <td>
                          <strong>{event.name}</strong>
                          <small className="table-subline">
                            {event.location}
                          </small>
                        </td>
                        <td>{formatDate(event.date)}</td>
                        {ticketing && (
                          <td>
                            {
                              state.tickets.filter(
                                (ticket) =>
                                  ticket.eventId === event.id &&
                                  ticket.status !== "cancelled",
                              ).length
                            }{" "}
                            / {event.capacity}
                          </td>
                        )}
                        <td>
                          <Status
                            tone={event.status === "draft" ? "amber" : "green"}
                          >
                            {event.status === "draft"
                              ? "Rascunho"
                              : "Publicado"}
                          </Status>
                        </td>
                        <td>
                          {event.status === "draft" ? (
                            <button
                              type="button"
                              className="text-button"
                              onClick={() => actions.publishEvent(event.id)}
                            >
                              Publicar
                            </button>
                          ) : ticketing ? (
                            <button
                              type="button"
                              className="text-button"
                              onClick={() => setSelected(event)}
                            >
                              Ver inscritos
                            </button>
                          ) : (
                            <span className="muted">Agenda publicada</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <DemoNote>
                Crie um evento aqui ou no formulário abaixo e veja as telas se
                atualizarem.
              </DemoNote>
            </>
          )}
          {page === "members" && (
            <>
              <label className="search-field">
                <Icon name="search" size={18} />
                <input
                  type="search"
                  aria-label="Buscar associado de demonstração"
                  placeholder="Buscar por nome"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <div className="family-list">
                {members.map((person) => (
                  <div className="family-person" key={person.id}>
                    <Avatar person={person} />
                    <div>
                      <strong>{person.name}</strong>
                      <span>{person.relationship} · Título familiar 00124</span>
                    </div>
                    <Status tone="green">Ativo</Status>
                  </div>
                ))}
              </div>
              {!members.length && (
                <p className="empty-state">Nenhum integrante encontrado.</p>
              )}
              <DemoNote>
                O exemplo representa uma família fictícia, sem acessar a base do
                clube.
              </DemoNote>
            </>
          )}
          {page === "posts" && (
            <>
              <form
                className="support-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (actions.addPost(postTitle, postBody)) setPostBody("");
                }}
              >
                <label className="field">
                  Título da publicação
                  <input
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    maxLength={80}
                    required
                  />
                </label>
                <label className="field">
                  Conteúdo
                  <textarea
                    value={postBody}
                    onChange={(e) => setPostBody(e.target.value)}
                    maxLength={400}
                    rows={3}
                    required
                  />
                </label>
                <Button type="submit" icon="news">
                  Publicar na demonstração
                </Button>
              </form>
              <p className="muted">
                {state.posts.length} publicações disponíveis na prévia do site e
                nos comunicados.
              </p>
            </>
          )}
          {page === "support" &&
            (state.messages.length ? (
              <div className="notice-list">
                {state.messages.map((message) => (
                  <article key={message.id}>
                    <Icon name="mail" />
                    <div>
                      <h4>{message.subject}</h4>
                      <p>{message.body}</p>
                      <Status tone="green">{message.status}</Status>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Icon name="support" size={36} />
                <h4>Nenhuma solicitação por enquanto</h4>
                <p>
                  Experimente o formulário Atendimento na área do associado.
                </p>
              </div>
            ))}
          {page === "gate" && (
            <>
              <a className="button button-primary" href="#portaria">
                Experimentar a leitura pelo celular
                <Icon name="scan" size={18} />
              </a>
              <div className="checkin-list">
                <h4>Últimas entradas desta demonstração</h4>
                {state.checkins.length ? (
                  state.checkins.map((entry) => (
                    <div
                      className="record-row"
                      key={`${entry.ticketId}-${entry.at}`}
                    >
                      <span>
                        <strong>{entry.name}</strong>
                        <small>{entry.ticketId}</small>
                      </span>
                      <Status tone="green">Entrada registrada</Status>
                    </div>
                  ))
                ) : (
                  <p className="muted">
                    As entradas aparecerão aqui após a validação de um ingresso.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {creating && (
        <Modal title="Novo evento" wide onClose={() => setCreating(false)}>
          <EventForm ticketing={ticketing} />
        </Modal>
      )}
      {ticketing && selected && (
        <Modal
          title={`Inscritos · ${selected.name}`}
          onClose={() => setSelected(null)}
        >
          {state.tickets.filter((ticket) => ticket.eventId === selected.id)
            .length ? (
            state.tickets
              .filter((ticket) => ticket.eventId === selected.id)
              .map((ticket) => (
                <div className="record-row" key={ticket.id}>
                  <span>
                    <strong>{ticket.name}</strong>
                    <small>{ticket.id}</small>
                  </span>
                  <Status tone={ticket.status === "used" ? "amber" : "green"}>
                    {ticket.status === "used" ? "Entrou" : "Disponível"}
                  </Status>
                </div>
              ))
          ) : (
            <p className="muted">
              Este evento ainda não tem inscrições nesta demonstração.
            </p>
          )}
        </Modal>
      )}
    </div>
  );
}
