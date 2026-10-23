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
    "O pacote web já inclui ingressos?",
    "Não. O web inclui site, agenda informativa, portal do associado, família, cobranças e administração básica. Ingressos, cadastro de não sócios, pagamentos de eventos e portaria pertencem ao pacote app adicional. A gestão de ingressos no painel só é habilitada por esse pacote; compra e QR Code ficam exclusivamente no app.",
  ],
  [
    "Quem não é sócio pode comprar ingresso?",
    "Sim, exclusivamente no app Android/iOS, nos eventos abertos ao público e somente com o pacote app contratado. O visitante cria sua própria conta, sem depender de um titular. Não haverá cadastro de não sócios, compra ou exibição de ingresso pelo site ou portal. Esta apresentação simula o app com dados fictícios.",
  ],
  [
    "A mensalidade já inclui a nuvem e a segurança?",
    `Sim. O pacote web mantém implantação de ${wholeMoney(proposal.implementationCents)} e mensalidade de ${wholeMoney(proposal.monthlyCents)} por ${proposal.termMonths} meses, com hospedagem, banco de dados, proteção, backups e manutenção. O pacote web não inclui app, ingressos ou portaria. Domínio e tarifas bancárias são separados.`,
  ],
  [
    "Preciso contratar o aplicativo junto com o web?",
    `Não. O clube pode contratar somente o site, o portal, a agenda informativa e a administração básica. Ingressos e portaria ficam fora desse escopo. Android/iOS é opcional, após implantação e aceite web e contratação própria. A proposta separada é ${wholeMoney(mobileProposal.developmentCents)} de desenvolvimento e ${wholeMoney(mobileProposal.monthlyCents)}/mês de manutenção adicional após lançamento e aceite.`,
  ],
  [
    "O portal e o aplicativo poderão usar dois fatores?",
    "Sim. O pacote web prevê senha mais código temporário de um aplicativo autenticador, obrigatório para administradores e funcionários e disponível aos associados. O aplicativo seguirá a mesma identidade se contratado. O fluxo mostrado nesta apresentação é apenas uma simulação.",
  ],
  [
    "O aplicativo terá o mesmo acesso do site?",
    "O associado usa a mesma conta e os dados da família e das cobranças na base web e no app. Os pacotes se complementam: o web organiza a gestão; o app acrescenta notificações e a experiência de eventos. Não sócios entram por uma área própria no app, sem acesso a família ou mensalidades de associados.",
  ],
  [
    "É necessário um computador na portaria?",
    "A portaria é um recurso do pacote app adicional. A equipe usa celular com câmera para preparar a lista e ler os QR Codes; a gestão e o acompanhamento ficam integrados ao painel. O pacote web básico não inclui portaria. Equipamentos e catracas serão avaliados separadamente.",
  ],
  [
    "Como a portaria funcionará sem internet?",
    "Somente no pacote app. Antes do evento, a equipe prepara o aparelho e baixa a lista atualizada. Sem internet, consulta essa lista, bloqueia repetição no mesmo celular e salva entradas. Ao reconectar, sincroniza. Novos ingressos e cancelamentos após o download exigem atualização. A prévia da apresentação apenas simula essa operação.",
  ],
  [
    "Preciso baixar algo para usar o sistema online?",
    "Site e portal web funcionam no navegador para os serviços de gestão contratados. Para comprar, receber e apresentar ingresso, associados e não sócios usam o app Android/iOS instalado. O associado pode salvar seu QR para contingência; a equipe prepara a lista da portaria antes de operar sem conexão.",
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
    "Na etapa web: origem das cobranças, integrações financeiras e exportação dos cadastros. Na etapa do pacote app: regras de ingressos, pagamentos de eventos e piloto da portaria, incluindo testes de carga e contingência offline. Os prazos são estimativas sujeitas à confirmação dessas dependências.",
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
              title="App Android/iOS + ingressos"
              label="02 · OPCIONAL, APÓS O WEB"
              stages={mobileDelivery}
              mobile
            />
          </div>
          <p className="delivery-assumptions">
            As estimativas incluem desenvolvimento e homologação conforme o
            escopo apresentado. Dependências de integrações, exportação de dados
            e retornos do clube serão confirmadas no levantamento. O app não
            condiciona a entrada do web em produção. Sem o pacote app, não há
            venda de ingressos, QR Code ou portaria. O piloto de eventos
            acontece na etapa app.
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
