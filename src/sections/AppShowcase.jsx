import { useDemo } from "../lib/DemoContext.jsx";
import { Icon } from "../components/ui.jsx";
import MobileApp, { appNavigation } from "../components/MobileApp.jsx";

const descriptions = {
  home: "Notícias e próximos encontros em uma tela simples.",
  bills: "Consulte mensalidades e experimente as formas de pagamento.",
  tickets: "Seu ingresso disponível para apresentar na entrada.",
  family: "Titular e dependentes vinculados ao mesmo acesso familiar.",
};
export default function AppShowcase() {
  const { appPage, setAppPage } = useDemo();
  return (
    <section className="section app-section section-anchor" id="aplicativo">
      <div className="container app-layout">
        <div className="app-section-copy">
          <h2>
            O clube no
            <br />
            seu bolso.
          </h2>
          <p>
            A família, as mensalidades e os próximos encontros sempre por perto.
          </p>
          <div className="app-feature-list" aria-label="Telas do aplicativo">
            {appNavigation.map((item) => (
              <button
                type="button"
                key={item.id}
                className={appPage === item.id ? "is-active" : ""}
                aria-pressed={appPage === item.id}
                onClick={() => setAppPage(item.id)}
              >
                <Icon name={item.icon} size={28} />
                <span>
                  <strong>{item.label}</strong>
                  {appPage === item.id && (
                    <small>{descriptions[item.id]}</small>
                  )}
                </span>
                <Icon name="next" size={18} />
              </button>
            ))}
          </div>
        </div>
        <div className="app-device-column">
          <MobileApp />
          <p className="device-caption">
            Prévia do aplicativo Android e iOS · Dados fictícios
          </p>
        </div>
      </div>
    </section>
  );
}
