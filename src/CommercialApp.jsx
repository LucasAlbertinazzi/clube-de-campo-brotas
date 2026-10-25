import { Brand, Icon, SectionHeading } from "./components/ui.jsx";
import InvestmentPlan from "./components/InvestmentPlan.jsx";
import DeliverySchedule from "./components/DeliverySchedule.jsx";
import {
  proposal,
  mobileProposal,
  recurringTotal,
  wholeMoney,
  webDelivery,
  mobileDelivery,
} from "./lib/pricing.mjs";

export default function CommercialApp() {
  return (
    <div className="commercial-page">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="commercial-header">
        <div className="container commercial-header-layout">
          <a
            href="#inicio"
            aria-label="Clube de Campo de Brotas · início da proposta comercial"
          >
            <Brand />
          </a>
          <nav
            className="commercial-navigation"
            aria-label="Seções da proposta comercial"
          >
            <a href="#pacotes">Pacotes e valores</a>
            <a href="#prazos">Prazos</a>
            <a href="#condicoes">Condições</a>
          </nav>
          <a className="button button-secondary" href="../">
            Ver demonstração <Icon name="external" size={17} />
          </a>
        </div>
      </header>
      <main id="conteudo">
        <section
          className="commercial-cover section-anchor"
          id="inicio"
          aria-labelledby="commercial-title"
        >
          <div className="container commercial-cover-layout">
            <div className="commercial-cover-copy">
              <span className="investment-eyebrow">
                CLUBE DE CAMPO DE BROTAS · PROPOSTA COMERCIAL
              </span>
              <h1 id="commercial-title">
                Uma base para gerir.
                <br />
                <span>Um app para participar.</span>
              </h1>
              <p>
                Primeiro, o site, o portal do associado e o painel organizam a
                rotina do clube. Depois, o app opcional conecta os serviços ao
                celular e acrescenta ingressos, vendas e portaria.
              </p>
              <div className="commercial-cover-actions">
                <a className="button button-primary" href="#pacotes">
                  Conhecer o investimento <Icon name="arrow" size={18} />
                </a>
                <a className="text-button" href="#prazos">
                  Entender as etapas <Icon name="clock" size={18} />
                </a>
              </div>
              <p className="commercial-reference">
                Condições de referência: {proposal.date}. Escopo e prazos
                estimados sujeitos à formalização contratual. As telas
                apresentadas são demonstrações com dados fictícios.
              </p>
            </div>
            <aside
              className="commercial-summary"
              aria-label="Resumo mensal dos pacotes"
            >
              <span className="investment-eyebrow">INVESTIMENTO MENSAL</span>
              <dl>
                <div>
                  <dt>Web · base de gestão</dt>
                  <dd>
                    {wholeMoney(proposal.monthlyCents)}
                    <small>/mês</small>
                  </dd>
                </div>
                <div>
                  <dt>App · adicional opcional</dt>
                  <dd>
                    + {wholeMoney(mobileProposal.monthlyCents)}
                    <small>/mês</small>
                  </dd>
                </div>
                <div className="commercial-summary-total">
                  <dt>Web + app, após os respectivos aceites</dt>
                  <dd>
                    {wholeMoney(recurringTotal({ includeMobile: true }))}
                    <small>/mês</small>
                  </dd>
                </div>
              </dl>
              <p>
                Implantação web e desenvolvimento do app são cobrados
                separadamente, conforme detalhado abaixo. Contratar o web não
                inclui nem inicia automaticamente o app.
              </p>
            </aside>
          </div>
        </section>
        <section
          className="section investment-section section-anchor"
          id="pacotes"
          aria-labelledby="commercial-packages-title"
        >
          <div className="container">
            <SectionHeading
              title={
                <span id="commercial-packages-title">
                  Escopo definido.
                  <br />
                  Investimento transparente.
                </span>
              }
              description="Dois pacotes complementares, com implantação, mensalidade e início de cobrança próprios."
            />
            <InvestmentPlan />
          </div>
        </section>
        <section
          className="section section-anchor"
          id="prazos"
          aria-labelledby="commercial-delivery-title"
        >
          <div className="container">
            <SectionHeading
              title={
                <span id="commercial-delivery-title">
                  Primeiro o web.
                  <br />
                  Depois, o app se contratado.
                </span>
              }
              description="Prazos em dias corridos. A aprovação das lojas é uma etapa externa adicional ao desenvolvimento do app."
            />
            <div className="delivery-grid">
              <DeliverySchedule
                title="Site, portal e painel web"
                label="01 · PACOTE WEB"
                stages={webDelivery}
              />
              <DeliverySchedule
                title="App Android/iOS + ingressos"
                label="02 · PACOTE APP ADICIONAL"
                stages={mobileDelivery}
                mobile
              />
            </div>
            <p className="delivery-assumptions">
              O web começa após contratação, escopo aprovado e entrega dos
              conteúdos, dados e acessos. O app começa após implantação e aceite
              web, contratação específica e liberação dos acessos. Integrações e
              retornos do clube serão confirmados no levantamento. O lançamento
              do app depende de aprovação Apple/Google e aceite do clube.
            </p>
          </div>
        </section>
        <section className="commercial-closing">
          <div className="container">
            <h2>
              Uma contratação por etapa.
              <br />
              Uma experiência que se completa.
            </h2>
            <p>
              Web para organizar o clube. App para aproximar associados,
              visitantes e eventos — com compra e QR Code exclusivamente no
              aplicativo.
            </p>
            <a className="button button-white" href="../">
              Explorar as funcionalidades <Icon name="arrow" size={18} />
            </a>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container footer-layout">
          <a href="#inicio" aria-label="Voltar ao início da proposta comercial">
            <Brand compact />
          </a>
          <p>
            Desenvolvido pela Nevuma Tech
            <br />
            <span>Proposta comercial · Condições sujeitas à contratação.</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
