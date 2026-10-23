import { useDemo } from "../lib/DemoContext.jsx";
import { Icon } from "../components/ui.jsx";
import MobileApp, { appNavigation } from "../components/MobileApp.jsx";

const descriptions = {
  home: "Notícias e próximos encontros em uma tela simples.",
  bills: "Consulte mensalidades e experimente as formas de pagamento.",
  tickets: "Consulte online ou salve o QR Code para apresentar sem internet.",
  family: "Titular e dependentes vinculados ao mesmo acesso familiar.",
};
export default function AppShowcase() {
  const { appPage, setAppPage } = useDemo();
  return (
    <section className="section app-section section-anchor" id="aplicativo">
      <div className="container app-layout">
        <div className="app-section-copy">
          <span className="app-optional-label">
            EVOLUÇÃO OPCIONAL · FORA DO PACOTE WEB
          </span>
          <h2>
            O clube no
            <br />
            seu bolso.
          </h2>
          <p>
            A família, as mensalidades e os próximos encontros sempre por perto.
            Android e iOS com contratação, investimento e prazo próprios, após a
            entrega web.
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
          <div className="app-offline-benefit">
            <Icon name="download" size={27} />
            <div>
              <h3>Seu QR Code, mesmo sem sinal.</h3>
              <p>
                Online funciona normalmente. Salvar é opcional: antes do evento,
                o associado pode guardar o ingresso no aplicativo e mostrar o
                mesmo QR Code sem internet. A portaria confirma a validade.
              </p>
            </div>
          </div>
        </div>
        <div className="app-device-column">
          <MobileApp />
          <p className="device-caption">
            Prévia opcional Android e iOS · Contratação separada · Dados
            fictícios
          </p>
        </div>
      </div>
    </section>
  );
}
