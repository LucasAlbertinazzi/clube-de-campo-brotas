import { Icon } from "./ui.jsx";
import { proposal, wholeMoney } from "../lib/pricing.mjs";

const scope = [
  "Site, notícias, fotos e documentos",
  "Associados, dependentes e administração",
  "Consulta e integração de pagamentos",
  "Eventos, ingressos e portaria pelo celular",
  "Aplicativo Android e iOS em uma etapa posterior",
  `Manutenção e até ${proposal.supportHours} horas de atendimento por mês`,
];
const services = [
  {
    icon: "dashboard",
    title: "Hospedagem e banco de dados",
    text: "Estrutura em nuvem para o site, o portal e os aplicativos.",
  },
  {
    icon: "shield",
    title: "Proteção e controle de acesso",
    text: "Criptografia, permissões por função e autenticação em dois fatores previstos no produto final.",
  },
  {
    icon: "reset",
    title: "Backups e monitoramento",
    text: "Cópias de segurança, alertas e acompanhamento da operação.",
  },
  {
    icon: "support",
    title: "Manutenção e atendimento",
    text: `Atualizações e até ${proposal.supportHours} horas mensais de atendimento em horário comercial.`,
  },
];

function Disclosure({ title, children }) {
  return (
    <details className="investment-disclosure">
      <summary>
        {title}
        <Icon name="down" size={19} />
      </summary>
      <div>{children}</div>
    </details>
  );
}

export default function InvestmentPlan() {
  return (
    <>
      <div className="investment-plan-grid">
        <article className="investment-main-card">
          <div className="investment-card-label">
            <span>PLATAFORMA UNIFICADA</span>
            <span>Web + aplicativo</span>
          </div>
          <p className="investment-price">
            {wholeMoney(proposal.monthlyCents)}
            <span>/ mês</span>
          </p>
          <p className="investment-price-description">
            Uma mensalidade para conectar a experiência do clube.
          </p>
          <div className="investment-entry">
            <div>
              <span>Implantação</span>
              <strong>{wholeMoney(proposal.implementationCents)}</strong>
            </div>
            <div>
              <span>Prazo da contratação</span>
              <strong>{proposal.termMonths} meses</strong>
            </div>
          </div>
          <ul className="investment-scope">
            {scope.map((item) => (
              <li key={item}>
                <Icon name="check" size={18} />
                {item}
              </li>
            ))}
          </ul>
          <p className="investment-included">
            <Icon name="shield" size={19} />
            <span>
              <strong>
                Hospedagem, manutenção, backups e segurança incluídos na
                mensalidade.
              </strong>{" "}
              Uma operação integrada para o clube e seus associados.
            </span>
          </p>
        </article>
        <div className="investment-side">
          <article className="investment-service-card">
            <span className="investment-eyebrow">O QUE ESTÁ INCLUÍDO</span>
            <h3>
              O clube conectado.
              <br />A operação acompanhada.
            </h3>
            <ul className="investment-service-list">
              {services.map((item) => (
                <li key={item.title}>
                  <span>
                    <Icon name={item.icon} size={21} />
                  </span>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <a className="text-button" href="#implantacao">
              Conhecer as etapas de entrega
              <Icon name="arrow" size={17} />
            </a>
          </article>
          <div className="investment-domain">
            <Icon name="home" size={23} />
            <div>
              <strong>O domínio continua sendo do clube.</strong>
              <p>
                A renovação permanece por conta do cliente. A configuração para
                o novo site entra na implantação.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="investment-disclosures">
        <Disclosure title="Despesas separadas">
          <ul className="investment-conditions">
            <li>
              <strong>Domínio:</strong> renovação do endereço atual pelo clube.
            </li>
            <li>
              <strong>Pagamentos:</strong> tarifas de boleto, Pix e cartão
              conforme o contrato do banco ou intermediador. A integração
              buscará preservar o acordo bancário atual.
            </li>
            <li>
              <strong>Lojas de aplicativos:</strong> contas e taxas de
              publicação da Apple e do Google Play, em nome do clube, na etapa
              de lançamento dos aplicativos.
            </li>
            <li>
              <strong>Portaria:</strong> celulares e conexão à internet
              fornecidos pelo clube.
            </li>
            <li>
              <strong>Serviços adicionais:</strong> envios pagos de SMS e
              WhatsApp, catracas, integrações extras e funcionalidades fora do
              escopo serão orçados separadamente.
            </li>
          </ul>
        </Disclosure>
        <Disclosure title="Etapas e condições de contratação">
          <ul className="investment-conditions">
            <li>
              <strong>Valores e prazo:</strong> implantação de{" "}
              {wholeMoney(proposal.implementationCents)} e mensalidade de{" "}
              {wholeMoney(proposal.monthlyCents)} por {proposal.termMonths}{" "}
              meses.
            </li>
            <li>
              <strong>Entrega em etapas:</strong> site, portal, administração e
              ingressos com QR Code primeiro. Os aplicativos Android e iOS
              entram em uma etapa posterior do mesmo escopo.
            </li>
            <li>
              <strong>Atendimento:</strong> até {proposal.supportHours} horas
              mensais em horário comercial. Demandas e funcionalidades
              adicionais terão orçamento próprio.
            </li>
            <li>
              <strong>Antes da implantação:</strong> confirmar a origem das
              cobranças, as integrações disponíveis, a exportação dos cadastros
              e as regras dos ingressos, com validação em um evento piloto.
            </li>
            <li>
              <strong>Contrato:</strong> escopo final, cronograma, condições de
              reajuste e cancelamento e propriedade do código serão definidos na
              proposta contratual.
            </li>
          </ul>
        </Disclosure>
      </div>
    </>
  );
}
