import { Brand, Icon, SectionHeading } from "../components/ui.jsx";
import DeliverySchedule from "../components/DeliverySchedule.jsx";
import {
  proposal,
  mobileProposal,
  wholeMoney,
  webDelivery,
  mobileDelivery,
} from "../lib/pricing.mjs";
import "./delivery.css";

const faq = [
  [
    "A mensalidade já inclui a nuvem e a segurança?",
    `Sim. O pacote web mantém implantação de ${wholeMoney(proposal.implementationCents)} e mensalidade de ${wholeMoney(proposal.monthlyCents)} por ${proposal.termMonths} meses, com hospedagem, banco de dados, proteção, backups e manutenção. O aplicativo do associado não está incluído. Domínio e tarifas bancárias são separados.`,
  ],
  [
    "Preciso contratar o aplicativo junto com o web?",
    `Não. O clube pode contratar somente o site, o portal, o painel e a portaria web. Android/iOS é opcional, após implantação e aceite web e contratação própria. A proposta separada é ${wholeMoney(mobileProposal.developmentCents)} de desenvolvimento e ${wholeMoney(mobileProposal.monthlyCents)}/mês de manutenção adicional após lançamento e aceite.`,
  ],
  [
    "O portal e o aplicativo poderão usar dois fatores?",
    "Sim. O pacote web prevê senha mais código temporário de um aplicativo autenticador, obrigatório para administradores e funcionários e disponível aos associados. O aplicativo seguirá a mesma identidade se contratado. O fluxo mostrado nesta apresentação é apenas uma simulação.",
  ],
  [
    "O aplicativo terá o mesmo acesso do site?",
    "Se contratado, o aplicativo usará a mesma conta e os serviços do portal. A proposta prevê uma conta por pessoa, com vínculo familiar. Funcionários terão acessos próprios e permissões por função.",
  ],
  [
    "É necessário um computador na portaria?",
    "O fluxo usa celular com câmera. Com internet, a equipe prepara e baixa a lista; durante o evento, poderá ler os QR Codes offline e sincronizar depois. A integração com catracas ou equipamentos existentes será avaliada separadamente, se necessária.",
  ],
  [
    "Como a portaria funcionará sem internet?",
    "A portaria online/offline pertence ao pacote web e não depende da contratação do app do associado. Antes do evento, a equipe baixa a lista atualizada no cliente de portaria preparado no aparelho. Sem internet, ele consulta essa lista, bloqueia repetição no mesmo celular e salva as entradas. Ao reconectar, sincroniza os registros. Ingressos novos e cancelamentos posteriores ao download exigem atualização. Esta página apenas simula o fluxo.",
  ],
  [
    "Preciso baixar algo para usar o sistema online?",
    "Não. O uso online é o padrão e funciona normalmente, tanto no aplicativo do associado quanto na portaria. Salvar o ingresso ou baixar a lista é opcional e prepara o aparelho para uma eventual falta de conexão. Sem internet, só estarão disponíveis os ingressos ou listas previamente salvos.",
  ],
  [
    "O associado poderá mostrar o ingresso sem internet?",
    "Esse recurso faz parte do aplicativo opcional. Se contratado, o associado poderá salvar um ingresso liberado com conexão e mostrar o mesmo QR sem internet. A portaria poderá conferir esse QR online ou pela lista offline já preparada. Exibir a cópia não garante entrada: a validade é conferida pela portaria. Alterações posteriores ao salvamento só serão conhecidas após atualizar os dados. A página demonstra o fluxo com dados fictícios.",
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
            title="Primeiro o web. Depois, o app se o clube escolher."
            description="Dois cronogramas e duas contratações. Prazos estimados em dias corridos, com desenvolvimento, testes e implantação em cada etapa."
          />
          <div className="delivery-grid">
            <DeliverySchedule
              title="Site, portal e painel web"
              label="01 · PACOTE WEB"
              stages={webDelivery}
            />
            <DeliverySchedule
              title="Aplicativo Android e iOS"
              label="02 · OPCIONAL, APÓS O WEB"
              stages={mobileDelivery}
              mobile
            />
          </div>
          <p className="delivery-assumptions">
            As estimativas incluem desenvolvimento e homologação conforme o
            escopo apresentado. Dependências de integrações, exportação de dados
            e retornos do clube serão confirmadas no levantamento. O app não
            condiciona a entrada do web em produção.
          </p>
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
            <br />
            <span>Desenvolvido pela Nevuma Tech</span>
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
