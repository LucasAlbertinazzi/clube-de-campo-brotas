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
    text: "Inscrições, QR Code e teste piloto.",
  },
  {
    icon: "phone",
    title: "Aplicativo e publicação",
    text: "Android, iOS e treinamento.",
  },
];
const faq = [
  [
    "O aplicativo terá o mesmo acesso do site?",
    "A proposta prevê uma conta por pessoa, com vínculo familiar e serviços compartilhados entre o portal e o aplicativo. Funcionários terão acessos próprios e permissões por função.",
  ],
  [
    "É necessário um computador na portaria?",
    "O fluxo de eventos foi pensado para funcionar em celular com câmera e internet. A integração com catracas ou equipamentos existentes será avaliada separadamente, se necessária.",
  ],
  [
    "Os pagamentos e cadastros já são reais?",
    "Não. Esta página é uma apresentação interativa com dados fictícios. Nenhum pagamento, cadastro, evento ou mensagem é enviado ao clube. O desenvolvimento final conectará os serviços contratados e validados na implantação.",
  ],
  [
    "Como funcionará a segurança dos ingressos?",
    "No produto final, cada ingresso terá um identificador validado no servidor, com registro de entrada e verificação de uso simultâneo. Nesta demonstração, os registros ficam somente no navegador e não servem como controle de acesso real.",
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
