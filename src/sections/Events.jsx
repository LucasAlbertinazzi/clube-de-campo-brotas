import { BrowserFrame, Icon } from "../components/ui.jsx";
import EventForm from "../components/EventForm.jsx";

export default function Events() {
  return (
    <section className="section events-section section-anchor" id="eventos">
      <div className="container events-layout">
        <div className="events-copy">
          <h2>
            Um evento começa
            <br />
            na organização.
          </h2>
          <p>Cadastre, publique e acompanhe as inscrições pelo mesmo painel.</p>
          <ol className="event-steps">
            {[
              {
                title: "Cadastre o evento",
                text: "Informe nome, data, horário e local.",
              },
              {
                title: "Defina ingressos e capacidade",
                text: "Configure valores e limite de participantes.",
              },
              {
                title: "Publique para os associados",
                text: "O evento aparece no site e no aplicativo.",
              },
              {
                title: "Acompanhe as entradas",
                text: "Consulte inscritos e registros da portaria.",
              },
            ].map((item, index) => (
              <li key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <BrowserFrame
          title="Administração · Novo evento"
          className="event-browser"
        >
          <div className="event-editor-heading">
            <div>
              <h3>Novo evento</h3>
              <p>Experimente publicar um evento de exemplo.</p>
            </div>
            <Icon name="calendar" size={24} />
          </div>
          <EventForm />
        </BrowserFrame>
      </div>
    </section>
  );
}
