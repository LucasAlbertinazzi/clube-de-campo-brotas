import { useDemo } from "../lib/DemoContext.jsx";
import { Icon, Tabs } from "../components/ui.jsx";
import MobileApp, { appNavigation } from "../components/MobileApp.jsx";

const descriptions = {
  home: "Notícias e próximos encontros em uma tela simples.",
  bills: "Consulte mensalidades e experimente as formas de pagamento.",
  tickets: "Consulte online ou salve o QR Code para apresentar sem internet.",
  family: "Titular e dependentes vinculados ao mesmo acesso familiar.",
};
export default function AppShowcase() {
  const { appPage, setAppPage, appAudience, setAppAudience } = useDemo();
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
            Um aplicativo com áreas distintas para associados e não sócios.
            Android e iOS com contratação, investimento e prazo próprios, após a
            entrega web.
          </p>
          <Tabs
            className="app-audience-tabs"
            label="Perfil da prévia do aplicativo"
            items={[
              { id: "member", label: "Sou associado", icon: "users" },
              { id: "visitor", label: "Não sou sócio", icon: "ticket" },
            ]}
            value={appAudience}
            onChange={setAppAudience}
          />
          {appAudience === "member" ? (
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
          ) : (
            <ul className="visitor-app-features">
              <li>
                <Icon name="users" />
                Login e cadastro próprios para não sócios.
              </li>
              <li>
                <Icon name="calendar" />
                Eventos abertos e preço de não sócio.
              </li>
              <li>
                <Icon name="ticket" />
                Compra, pagamento simulado e ingresso com QR Code.
              </li>
              <li>
                <Icon name="shield" />
                Somente compras e ingressos da própria conta.
              </li>
            </ul>
          )}
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
            Um app · Dois perfis · Contratação opcional · Dados fictícios
          </p>
        </div>
      </div>
    </section>
  );
}
