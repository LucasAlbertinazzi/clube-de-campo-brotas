import { useState } from "react";
import { Icon, SectionHeading, Tabs } from "../components/ui.jsx";
import SecurityPreview from "../components/SecurityPreview.jsx";
import { proposal } from "../lib/pricing.mjs";
import InvestmentPlan from "../components/InvestmentPlan.jsx";
import "./investment.css";

const tabs = [
  { id: "investment", label: "Investimento", icon: "card" },
  { id: "security", label: "Segurança e 2FA", icon: "shield" },
];
const protections = [
  {
    icon: "shield",
    title: "Criptografia no caminho e no banco",
    text: "HTTPS/TLS no web e, se contratado, no aplicativo. Banco gerenciado com criptografia dos dados armazenados e acesso restrito aos serviços autorizados.",
  },
  {
    icon: "phone",
    title: "Dois fatores no web e no app opcional",
    text: "Senha mais código temporário de aplicativo autenticador. Previsto como obrigatório para administradores e funcionários, e disponível aos associados.",
  },
  {
    icon: "users",
    title: "Cada pessoa com sua permissão",
    text: "Perfis de associado, secretaria e administração no web; não sócios e portaria habilitados pelo pacote app. Senhas protegidas por hash, encerramento de sessões e recuperação de acesso com verificação de identidade.",
  },
  {
    icon: "qr",
    title: "Pacote app: validação online e offline",
    text: "Somente com o pacote app. Online, o servidor controla as entradas entre aparelhos. Offline, a lista protegida bloqueia repetição no mesmo celular; listas separadas por portaria e conferência de conflitos na sincronização organizam o uso de vários aparelhos.",
  },
  {
    icon: "reset",
    title: "Backups e recuperação",
    text: "Backups diários do banco com recuperação dos últimos sete dias, backup do servidor e testes periódicos de restauração na operação do produto final.",
  },
  {
    icon: "list",
    title: "Auditoria e acompanhamento",
    text: "Histórico de ações administrativas e, com o pacote app, leituras na portaria. Monitoramento básico, alertas e atualizações de segurança incluídos na rotina de manutenção.",
  },
];

function SecurityPlan() {
  return (
    <>
      <div className="security-plan-grid">
        <div className="security-plan-copy">
          <span className="investment-eyebrow">PROTEÇÃO EM CADA ACESSO</span>
          <h3>
            Uma conta segura.
            <br />
            No web e no app opcional.
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
                <p>
                  A mesma identidade conecta o portal ao aplicativo, se
                  contratado.
                </p>
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
              description="Web para gestão. App adicional para experiência mobile, ingressos e portaria. Veja exatamente o que cada pacote entrega."
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
          {tab === "investment" ? <InvestmentPlan /> : <SecurityPlan />}
        </div>
      </div>
    </section>
  );
}
