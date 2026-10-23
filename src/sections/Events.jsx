import { BrowserFrame, Icon } from "../components/ui.jsx";
import EventForm from "../components/EventForm.jsx";

export default function Events() {
  return (
    <section className="section events-section section-anchor" id="eventos">
      <div className="container events-layout">
        <div className="events-copy">
          <span className="investment-eyebrow">
            PACOTE APP · GESTÃO INTEGRADA NO PAINEL
          </span>
          <h2>
            Um evento começa
            <br />
            na organização.
          </h2>
          <p>
            Com o pacote app contratado, a equipe configura ingressos no painel.
            Associados e não sócios compram e recebem o QR Code somente no
            aplicativo. O web básico oferece apenas agenda informativa.
          </p>
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
                title: "Escolha quem pode comprar",
                text: "Defina eventos exclusivos ou abertos a não sócios. A compra acontece somente no app.",
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
          title="Pacote app · Gestão de ingressos no painel"
          className="event-browser"
        >
          <div className="event-editor-heading">
            <div>
              <h3>Novo evento</h3>
              <p>Recurso adicional do pacote app. Sem compra pelo navegador.</p>
            </div>
            <Icon name="calendar" size={24} />
          </div>
          <EventForm />
        </BrowserFrame>
      </div>
    </section>
  );
}
