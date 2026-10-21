import { useState } from "react";
import { Icon, SectionHeading, Tabs } from "../components/ui.jsx";
import SecurityPreview from "../components/SecurityPreview.jsx";
import {
  calculateProposal,
  infrastructure,
  money,
  proposal,
  wholeMoney,
} from "../lib/pricing.mjs";
import "./investment.css";

const totals = calculateProposal();
const tabs = [
  { id: "investment", label: "Investimento", icon: "card" },
  { id: "security", label: "Segurança e 2FA", icon: "shield" },
  { id: "cloud", label: "Custos de nuvem", icon: "dashboard" },
];
const scope = [
  "Site, notícias, fotos e documentos",
  "Associados, dependentes e administração",
  "Consulta e integração de pagamentos",
  "Eventos, ingressos e portaria pelo celular",
  "Aplicativo Android e iOS em uma etapa posterior",
  "Manutenção e até 4 horas de atendimento por mês",
];
const protections = [
  {
    icon: "shield",
    title: "Criptografia no caminho e no banco",
    text: "HTTPS/TLS no site e nos aplicativos. Banco gerenciado com criptografia dos dados armazenados e acesso restrito aos serviços autorizados.",
  },
  {
    icon: "phone",
    title: "Dois fatores no web e no app",
    text: "Senha mais código temporário de aplicativo autenticador. Previsto como obrigatório para administradores e funcionários, e disponível aos associados.",
  },
  {
    icon: "users",
    title: "Cada pessoa com sua permissão",
    text: "Perfis separados para associado, secretaria, administração e portaria. Senhas protegidas por hash, encerramento de sessões e recuperação de acesso com verificação de identidade.",
  },
  {
    icon: "qr",
    title: "Um ingresso, uma entrada",
    text: "Identificador exclusivo e validação no servidor, com registro de uso para impedir entradas duplicadas, inclusive entre celulares diferentes.",
  },
  {
    icon: "reset",
    title: "Backups e recuperação",
    text: "Backups diários do banco com recuperação dos últimos sete dias, backup do servidor e testes periódicos de restauração na operação do produto final.",
  },
  {
    icon: "list",
    title: "Auditoria e acompanhamento",
    text: "Histórico de ações administrativas e leituras na portaria. Monitoramento básico, alertas e atualizações de segurança incluídos na rotina de manutenção.",
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

function InvestmentPlan() {
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
              <span>Entrada e implantação</span>
              <strong>{wholeMoney(proposal.implementationCents)}</strong>
            </div>
            <div>
              <span>Desenvolvimento diluído em</span>
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
              Nuvem, backups, proteção e segurança previstos no plano.{" "}
              <strong>Os R$800 de infraestrutura já estão incluídos.</strong>
            </span>
          </p>
        </article>
        <div className="investment-side">
          <article className="investment-savings-card">
            <span className="investment-eyebrow">COMPARAÇÃO MENSAL</span>
            <h3>
              Mais conectado.
              <br />
              Custo recorrente menor.
            </h3>
            <div className="investment-comparison">
              <div>
                <span>Valor atual informado*</span>
                <strong>{wholeMoney(proposal.referenceMonthlyCents)}</strong>
              </div>
              <div className="comparison-bar comparison-bar-old" />
              <div>
                <span>Plataforma proposta</span>
                <strong>{wholeMoney(proposal.monthlyCents)}</strong>
              </div>
              <div
                className="comparison-bar comparison-bar-new"
                style={{ width: `${100 - totals.savingsPercent}%` }}
              />
            </div>
            <div className="investment-saving-value">
              <strong>
                {wholeMoney(totals.monthlySavingsCents)}
                <small>/ mês</small>
              </strong>
              <span>{totals.savingsPercent}% de redução recorrente</span>
            </div>
            <p>
              {wholeMoney(totals.annualSavingsCents)} de redução anual nas
              mensalidades, antes da entrada e de despesas variáveis.
            </p>
            <small>
              *Referência aproximada fornecida pelo clube, a confirmar na
              contratação. Tarifas bancárias comparadas separadamente.
            </small>
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
      <div className="investment-total-grid">
        <div>
          <span>Primeiro ano, com implantação</span>
          <strong>{wholeMoney(totals.firstYearCents)}</strong>
          <p>
            Referência atual: R$36.000 no ano. A entrada faz o primeiro ano
            superar esse valor.
          </p>
        </div>
        <div>
          <span>Total previsto em 48 meses</span>
          <strong>{wholeMoney(totals.contractTotalCents)}</strong>
          <p>
            Inclui R$7.900 de entrada e todas as mensalidades, sem reajustes ou
            despesas separadas.
          </p>
        </div>
        <div>
          <span>Entrega em etapas</span>
          <strong>Web → aplicativo</strong>
          <p>
            Site, portal e QR Code primeiro. Android e iOS entram na etapa
            seguinte do mesmo escopo.
          </p>
        </div>
      </div>
      <div className="investment-disclosures">
        <Disclosure title="Como a mensalidade e a entrada foram calculadas">
          <p>
            A referência de desenvolvimento completo é de{" "}
            {wholeMoney(proposal.developmentCents)}. A entrada reduzida de{" "}
            {wholeMoney(proposal.implementationCents)} deixa{" "}
            {wholeMoney(
              proposal.developmentCents - proposal.implementationCents,
            )}{" "}
            distribuídos pelos {proposal.termMonths} meses do contrato.
          </p>
          <dl className="investment-breakdown">
            <div>
              <dt>Infraestrutura e reserva operacional</dt>
              <dd>{money(proposal.infrastructureBudgetCents)}/mês</dd>
            </div>
            <div>
              <dt>Desenvolvimento diluído</dt>
              <dd>{money(totals.developmentMonthlyCents)}/mês</dd>
            </div>
            <div>
              <dt>Operação, manutenção e atendimento</dt>
              <dd>{money(totals.serviceMonthlyCents)}/mês</dd>
            </div>
            <div className="breakdown-total">
              <dt>Mensalidade total</dt>
              <dd>{money(proposal.monthlyCents)}</dd>
            </div>
          </dl>
          <p>
            Atendimento em horário comercial, com até {proposal.supportHours}{" "}
            horas mensais. A composição de operação também cobre tributos e
            remuneração do prestador. Funcionalidades adicionais terão orçamento
            próprio.
          </p>
        </Disclosure>
        <Disclosure title="O que fica separado e precisa ser confirmado">
          <ul className="investment-conditions">
            <li>
              <strong>Pagamentos:</strong> tarifas de boleto, Pix e cartão
              conforme o banco ou intermediador. Buscar manter o acordo bancário
              atual. Como exemplo, R$1,99 por recebimento × 1.000 recebimentos =
              R$1.990 de tarifas, além do plano.{" "}
              <a
                href="https://www.asaas.com/precos-e-taxas"
                target="_blank"
                rel="noreferrer"
              >
                Referência Asaas
              </a>
              .
            </li>
            <li>
              <strong>Publicação do aplicativo:</strong> conta Apple de
              US$99/ano (aproximadamente R$594/ano) e Google Play de US$25 uma
              vez (aproximadamente R$150), usando o mesmo câmbio de
              planejamento. Contas em nome do clube.{" "}
              <a
                href="https://developer.apple.com/programs/enroll/"
                target="_blank"
                rel="noreferrer"
              >
                Apple
              </a>{" "}
              ·{" "}
              <a
                href="https://support.google.com/googleplay/android-developer/answer/6112435?hl=pt-BR"
                target="_blank"
                rel="noreferrer"
              >
                Google
              </a>
              .
            </li>
            <li>
              <strong>Operação local:</strong> celulares e internet da portaria
              pelo clube. SMS e WhatsApp pagos, catracas e integrações extras
              não entram na estimativa.
            </li>
            <li>
              <strong>Fechamento do escopo:</strong> confirmar a origem das
              cobranças, APIs disponíveis, exportação dos cadastros e regras dos
              ingressos. Propriedade do código, reajustes e saldo de
              desenvolvimento em saída antecipada serão definidos na proposta
              contratual.
            </li>
          </ul>
        </Disclosure>
      </div>
    </>
  );
}

function SecurityPlan() {
  return (
    <>
      <div className="security-plan-grid">
        <div className="security-plan-copy">
          <span className="investment-eyebrow">PROTEÇÃO EM CADA ACESSO</span>
          <h3>
            Uma conta segura.
            <br />
            No site e no aplicativo.
          </h3>
          <p>
            A autenticação em dois fatores acrescenta uma confirmação depois da
            senha. Assim, uma senha descoberta sozinha não basta para concluir o
            login.
          </p>
          <ol className="security-login-steps">
            <li>
              <span>01</span>
              <div>
                <strong>Entre com sua conta</strong>
                <p>A mesma identidade conecta portal e aplicativo.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Confirme o segundo fator</strong>
                <p>Use o código temporário do autenticador cadastrado.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Acesse com a permissão certa</strong>
                <p>Associados e equipe veem apenas as funções autorizadas.</p>
              </div>
            </li>
          </ol>
          <p className="security-recovery">
            <Icon name="support" size={19} />
            Códigos de recuperação e um procedimento de verificação de
            identidade devem permitir recuperar o acesso caso a pessoa perca o
            celular.
          </p>
        </div>
        <SecurityPreview />
      </div>
      <div className="security-protections">
        {protections.map((item) => (
          <article key={item.title}>
            <span className="security-feature-icon">
              <Icon name={item.icon} size={25} />
            </span>
            <h4>{item.title}</h4>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
      <div className="investment-note">
        <Icon name="shield" size={21} />
        <p>
          <strong>Recursos previstos para o produto final.</strong> Esta
          apresentação usa dados fictícios e não possui autenticação,
          criptografia de dados de associados ou controle de acesso em produção.
          A simulação demonstra a experiência proposta.
        </p>
      </div>
    </>
  );
}

function CloudCosts() {
  return (
    <>
      <div className="cloud-heading">
        <div>
          <span className="investment-eyebrow">ORÇAMENTO OPERACIONAL</span>
          <h3>
            Uma estrutura em nuvem,
            <br />
            compartilhada pelo site e pelos apps.
          </h3>
          <p>
            Referência para 1.000 titulares mais dependentes, tráfego moderado e
            fotos otimizadas. O aplicativo usa os mesmos serviços e o mesmo
            banco do portal.
          </p>
        </div>
        <div className="cloud-budget">
          <span>Reserva mensal de infraestrutura</span>
          <strong>{wholeMoney(proposal.infrastructureBudgetCents)}</strong>
          <small>já dentro dos R$2.490/mês</small>
        </div>
      </div>
      <div className="cloud-table-wrap">
        <table className="cloud-table">
          <caption>
            Custos mensais dos fornecedores · câmbio de planejamento de R$6/US$
            · consulta em {proposal.date}
          </caption>
          <thead>
            <tr>
              <th scope="col">Serviço</th>
              <th scope="col">US$/mês</th>
              <th scope="col">R$/mês</th>
            </tr>
          </thead>
          <tbody>
            {infrastructure.map((item) => (
              <tr key={item.name}>
                <th scope="row">
                  <a href={item.source} target="_blank" rel="noreferrer">
                    {item.name}
                    <Icon name="external" size={14} />
                  </a>
                  <small>{item.detail}</small>
                </th>
                <td>
                  {(item.usdCents / 100).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td>{money(item.usdCents * proposal.exchangeRate)}</td>
              </tr>
            ))}
            <tr>
              <th scope="row">Subtotal dos fornecedores</th>
              <td>111,65</td>
              <td>{money(totals.cloudCents)}</td>
            </tr>
            <tr>
              <th scope="row">
                Reserva para câmbio, encargos e pequenos excedentes
              </th>
              <td>—</td>
              <td>{money(totals.reserveCents)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Orçamento mensal de infraestrutura</th>
              <td>—</td>
              <td>{money(proposal.infrastructureBudgetCents)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="cloud-info-grid">
        <article>
          <Icon name="shield" size={26} />
          <h4>Criptografia já incluída</h4>
          <p>
            O PostgreSQL gerenciado inclui criptografia em repouso e em
            trânsito. O orçamento não acrescenta uma licença separada de
            criptografia.
          </p>
          <a
            href="https://docs.digitalocean.com/products/databases/postgresql/how-to/secure/"
            target="_blank"
            rel="noreferrer"
          >
            Segurança do banco
            <Icon name="external" size={14} />
          </a>
        </article>
        <article>
          <Icon name="reset" size={26} />
          <h4>Backup do banco incluído</h4>
          <p>
            Backups diários e recuperação dos últimos sete dias fazem parte do
            banco gerenciado. A linha da tabela é o backup adicional do
            servidor.
          </p>
          <a
            href="https://docs.digitalocean.com/products/databases/postgresql/details/features/"
            target="_blank"
            rel="noreferrer"
          >
            Recursos do banco
            <Icon name="external" size={14} />
          </a>
        </article>
        <article>
          <Icon name="dashboard" size={26} />
          <h4>Crescimento acompanhado</h4>
          <p>
            Monitoramento básico e alertas entram na operação. Picos, volumes
            maiores e redundância ativa exigem novo dimensionamento e revisão do
            orçamento.
          </p>
        </article>
      </div>
      <div className="investment-note">
        <Icon name="file" size={21} />
        <p>
          Estimativa de planejamento com preços públicos de referência.
          Capacidade a validar em testes de carga e em evento piloto. Valores
          dos fornecedores variam com câmbio, região e consumo; a configuração
          inicial não inclui redundância ativa de servidores.
        </p>
      </div>
    </>
  );
}

export default function Investment() {
  const [tab, setTab] = useState("investment");
  return (
    <section
      className="section investment-section section-anchor"
      id="investimento"
    >
      <div className="container">
        <div className="investment-section-heading">
          <div>
            <span className="investment-eyebrow">INVESTIMENTO E SEGURANÇA</span>
            <SectionHeading
              title={
                <>
                  Um clube conectado.
                  <br />
                  Um investimento previsível.
                </>
              }
              description="Valores, infraestrutura e proteção para colocar a proposta em prática."
            />
          </div>
          <span className="investment-reference">
            <Icon name="calendar" size={16} />
            Referência · {proposal.date}
          </span>
        </div>
        <Tabs
          className="investment-tabs"
          label="Detalhes de investimento e segurança"
          items={tabs}
          value={tab}
          onChange={setTab}
        />
        <div
          className="investment-panel"
          role="tabpanel"
          aria-label={tabs.find((item) => item.id === tab).label}
          tabIndex={0}
        >
          {tab === "investment" ? (
            <InvestmentPlan />
          ) : tab === "security" ? (
            <SecurityPlan />
          ) : (
            <CloudCosts />
          )}
        </div>
      </div>
    </section>
  );
}
