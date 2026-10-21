import { Brand, Icon, SectionHeading } from "../components/ui.jsx";

const steps = [
  {
    icon: "file",
    title: "Identidade e conteúdo",
    text: "Site, eventos, fotos e documentos.",
  },
  {
    icon: "users",
    title: "Associados e administração",
    text: "Famílias, cobranças e acessos.",
  },
  {
    icon: "calendar",
    title: "Eventos e portaria",
    text: "QR Code online/offline e teste piloto.",
  },
  {
    icon: "phone",
    title: "Aplicativo e publicação",
    text: "Android, iOS e treinamento.",
  },
];
const faq = [
  [
    "A mensalidade já inclui a nuvem e a segurança?",
    "Sim. A mensalidade de R$2.490 inclui hospedagem, banco de dados, proteção, backups e manutenção. A implantação é de R$7.900, com contratação por 48 meses. Domínio, tarifas bancárias e contas das lojas de aplicativos ficam separados. Consulte a seção Investimento para conhecer o escopo e as condições.",
  ],
  [
    "O portal e o aplicativo poderão usar dois fatores?",
    "Sim. A proposta inclui senha mais código temporário de um aplicativo autenticador, com implantação prevista no web e nos aplicativos. Será obrigatório para administradores e funcionários e disponível aos associados. O fluxo mostrado nesta apresentação é apenas uma simulação.",
  ],
  [
    "O aplicativo terá o mesmo acesso do site?",
    "A proposta prevê uma conta por pessoa, com vínculo familiar e serviços compartilhados entre o portal e o aplicativo. Funcionários terão acessos próprios e permissões por função.",
  ],
  [
    "É necessário um computador na portaria?",
    "O fluxo usa celular com câmera. Com internet, a equipe prepara e baixa a lista; durante o evento, poderá ler os QR Codes offline e sincronizar depois. A integração com catracas ou equipamentos existentes será avaliada separadamente, se necessária.",
  ],
  [
    "Como a portaria funcionará sem internet?",
    "Antes do evento, a equipe entra com seu acesso autorizado e baixa a lista atualizada no aparelho. Sem internet, o aplicativo consulta essa lista, bloqueia a repetição no mesmo celular e salva as entradas localmente. Quando a conexão voltar, os registros são sincronizados. Ingressos novos e cancelamentos posteriores ao download só serão conhecidos após atualizar a lista. A prévia desta página apenas simula esse fluxo com dados fictícios.",
  ],
  [
    "Preciso baixar algo para usar o sistema online?",
    "Não. O uso online é o padrão e funciona normalmente, tanto no aplicativo do associado quanto na portaria. Salvar o ingresso ou baixar a lista é opcional e prepara o aparelho para uma eventual falta de conexão. Sem internet, só estarão disponíveis os ingressos ou listas previamente salvos.",
  ],
  [
    "O associado poderá mostrar o ingresso sem internet?",
    "Sim. Antes do evento, com conexão, o associado poderá salvar um ingresso liberado no aplicativo. Depois, abrirá a cópia salva e mostrará o mesmo QR Code sem internet. A portaria poderá conferir esse QR online ou pela própria lista offline já preparada. Exibir a cópia não garante entrada: a validade é conferida pela portaria, e alterações posteriores ao salvamento só serão conhecidas após atualizar os dados. Esta página demonstra o fluxo com dados fictícios.",
  ],
  [
    "É possível usar vários celulares offline?",
    "Celulares desconectados não compartilham as leituras em tempo real. O plano operacional deverá usar um aparelho offline por evento ou dividir os ingressos em listas exclusivas por portaria/aparelho. Se o mesmo ingresso for aceito por aparelhos desconectados, a sincronização sinalizará o conflito para conferência, mas não desfará uma entrada que já aconteceu.",
  ],
  [
    "Os pagamentos e cadastros já são reais?",
    "Não. Esta página é uma apresentação interativa com dados fictícios. Nenhum pagamento, cadastro, evento ou mensagem é enviado ao clube. O desenvolvimento final conectará os serviços contratados e validados na implantação.",
  ],
  [
    "Como funcionará a segurança dos ingressos?",
    "No produto final, a validação online será centralizada. O modo offline usará uma lista protegida, autorizada e válida para o evento, com registro local e sincronização posterior. O bloqueio entre aparelhos desconectados depende da divisão das listas. Nesta demonstração, os registros ficam no navegador e não servem como controle de acesso real.",
  ],
  [
    "O que precisa ser confirmado antes da implantação?",
    "A origem das cobranças, o acesso às integrações de pagamento, a exportação dos cadastros e as regras dos ingressos. Também será realizado um evento piloto para validar o funcionamento da portaria.",
  ],
];
export default function Roadmap() {
  return (
    <>
      <section
        className="section roadmap-section section-anchor"
        id="implantacao"
      >
        <div className="container">
          <SectionHeading
            title="Uma implantação em etapas."
            description="Começar com o essencial e validar com quem usa o clube todos os dias."
          />
          <ol className="roadmap">
            {steps.map((step, index) => (
              <li key={step.title}>
                <div className="roadmap-top">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <Icon name={step.icon} size={27} />
                  {index < 3 && <Icon name="arrow" size={21} />}
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="faq-section">
        <div className="container faq-container">
          <SectionHeading
            title="O que esta proposta contempla"
            description="As principais dúvidas sobre a experiência apresentada."
          />
          <div className="faq-list">
            {faq.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <Icon name="down" size={20} />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="closing-section">
        <div className="container closing-layout">
          <h2>
            Uma experiência mais próxima.
            <br />
            Um clube mais conectado.
          </h2>
          <a className="button button-white" href="#experiencias">
            Explorar a demonstração
            <Icon name="arrow" size={18} />
          </a>
        </div>
      </section>
      <footer className="site-footer">
        <div className="container footer-layout">
          <a href="#proposta" aria-label="Voltar ao início da apresentação">
            <Brand compact />
          </a>
          <p>
            Conceito de experiência digital · Dados fictícios
            <br />
            <span>
              Apresentação independente. Este não é o portal oficial do clube.
            </span>
          </p>
          <div>
            <a
              href="https://www.clubedecampodebrotas.com.br/"
              target="_blank"
              rel="noreferrer"
            >
              Site atual
              <Icon name="external" size={15} />
            </a>
            <a
              href="https://github.com/LucasAlbertinazzi/clube-de-campo-brotas"
              target="_blank"
              rel="noreferrer"
            >
              Código da apresentação
              <Icon name="external" size={15} />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
