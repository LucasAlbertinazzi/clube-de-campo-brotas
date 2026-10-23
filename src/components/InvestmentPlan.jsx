import { Icon } from "./ui.jsx";
import {
  proposal,
  mobileProposal,
  recurringTotal,
  wholeMoney,
  webDelivery,
  mobileDelivery,
  deliveryDays,
} from "../lib/pricing.mjs";

const scope = [
  "Site, notícias, fotos e documentos",
  "Associados, dependentes e administração",
  "Consulta e integração de pagamentos",
  "Eventos, ingressos e portaria online e offline pelo celular",
  "Login de não sócios e compra de ingressos em eventos abertos",
  `Manutenção e até ${proposal.supportHours} horas de atendimento por mês`,
];
const services = [
  {
    icon: "dashboard",
    title: "Hospedagem e banco de dados",
    text: "Estrutura em nuvem para o site, o portal e o painel web.",
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
            <span>PACOTE WEB</span>
            <span>Site + portal + painel</span>
          </div>
          <p className="investment-price">
            {wholeMoney(proposal.monthlyCents)}
            <span>/ mês</span>
          </p>
          <p className="investment-price-description">
            A plataforma web completa. Aplicativo contratado separadamente.
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
          <p className="package-deadline">
            <Icon name="clock" size={18} />
            Prazo proposto: {deliveryDays(webDelivery)} dias corridos até a
            implantação web.
          </p>
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
              O aplicativo Android/iOS não está incluído neste pacote.
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
      <article className="mobile-offer" aria-labelledby="mobile-offer-title">
        <div className="mobile-offer-copy">
          <span className="investment-eyebrow">
            OPCIONAL · CONTRATAÇÃO SEPARADA
          </span>
          <h3 id="mobile-offer-title">Aplicativo Android e iOS</h3>
          <p>
            A prévia continua na apresentação para mostrar a evolução possível.
            O clube pode contratar somente a plataforma web.
          </p>
          <ul>
            <li>
              Áreas de associado e não sócio no mesmo app, integradas ao web.
              Família e cobranças para associados; eventos, compras e ingressos
              para visitantes.
            </li>
            <li>
              Notificações e ingresso salvo para mostrar o QR Code sem internet.
            </li>
            <li>
              Desenvolvimento iniciado após a implantação e o aceite web,
              mediante contratação específica.
            </li>
          </ul>
          <a className="text-button" href="#aplicativo">
            Explorar a prévia do aplicativo <Icon name="arrow" size={17} />
          </a>
        </div>
        <div className="mobile-offer-terms">
          <span className="proposal-status">
            Proposta comercial · contratação separada
          </span>
          <dl>
            <div>
              <dt>Desenvolvimento e implantação do app</dt>
              <dd>{wholeMoney(mobileProposal.developmentCents)}</dd>
            </div>
            <div>
              <dt>Manutenção adicional após o lançamento</dt>
              <dd>
                {wholeMoney(mobileProposal.monthlyCents)}
                <small> / mês</small>
              </dd>
            </div>
            <div>
              <dt>Desenvolvimento, testes e envio às lojas</dt>
              <dd>
                {deliveryDays(mobileDelivery)} dias<small> corridos</small>
              </dd>
            </div>
          </dl>
          <p>
            A análise das lojas é adicional aos {deliveryDays(mobileDelivery)}{" "}
            dias. A implantação pública acontece após aprovação e liberação do
            clube.
          </p>
          <p>
            A manutenção contempla correções, compatibilidade com Android/iOS e
            atualizações nas lojas. Taxas Apple/Google são separadas; vigência e
            suporte do app serão definidos na contratação.
          </p>
          <p>
            <strong>
              Web + app, se contratado:{" "}
              {wholeMoney(recurringTotal({ includeMobile: true }))}/mês.
            </strong>{" "}
            O adicional do app começa após seu lançamento e aceite.
          </p>
        </div>
      </article>
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
              de lançamento do aplicativo, somente se contratado.
            </li>
            <li>
              <strong>Portaria:</strong> celulares e internet para preparar as
              listas e sincronizar as entradas, fornecidos pelo clube. A leitura
              poderá continuar offline com a lista já baixada.
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
              <strong>Dois escopos independentes:</strong> o pacote web inclui
              site, portal, administração e portaria com QR Code online/offline.
              O aplicativo do associado é opcional, tem preço próprio e só
              começa após o aceite web e contratação específica.
            </li>
            <li>
              <strong>Início dos prazos:</strong> contagem após contratação,
              escopo aprovado e disponibilização dos conteúdos, dados e acessos
              necessários. A etapa mobile também depende da implantação e do
              aceite web. Prazos propostos sujeitos à validação das integrações
              no levantamento.
            </li>
            <li>
              <strong>Mensalidades:</strong> a cobrança web começa após
              implantação e aceite da plataforma. O adicional mobile começa após
              lançamento e aceite do app, somente se contratado. Datas e
              condições serão formalizadas em contrato.
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
