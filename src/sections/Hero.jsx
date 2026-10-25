import { useDemo } from "../lib/DemoContext.jsx";
import { Brand, BrowserFrame, Icon, asset } from "../components/ui.jsx";
import { MiniPhone } from "../components/MobileApp.jsx";

export default function Hero() {
  const { setExperience } = useDemo();
  return (
    <>
      <section
        className="hero section-anchor"
        id="proposta"
        aria-labelledby="hero-title"
      >
        <div className="container hero-layout">
          <div className="hero-copy">
            <h1 id="hero-title">
              Mais clube.
              <br />
              <span>Menos distância.</span>
            </h1>
            <p>
              Duas etapas que se completam: o web organiza o clube, os cadastros
              e as cobranças. O pacote app opcional leva os serviços ao celular
              e acrescenta ingressos, compras e portaria. Cada pacote com
              investimento e prazo próprios.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#experiencias">
                Conhecer a experiência
                <Icon name="arrow" size={18} />
              </a>
              <a className="button button-secondary" href="#pacotes">
                <Icon name="list" size={20} />
                Comparar os pacotes
              </a>
            </div>
            <span className="hero-disclosure">
              Demonstração interativa com dados fictícios
            </span>
          </div>
          <div className="hero-devices">
            <BrowserFrame
              title="Prévia do site do clube"
              className="hero-browser"
            >
              <div className="hero-browser-nav">
                <Brand compact />
                <span>O clube</span>
                <span>Eventos</span>
                <span>Notícias</span>
                <a href="#experiencias" onClick={() => setExperience("member")}>
                  Área do associado
                </a>
              </div>
              <div className="hero-site-photo">
                <img
                  src={asset("clube-paisagem.jpeg")}
                  alt="Foto original do lago do Clube de Campo de Brotas"
                  fetchPriority="high"
                  width="1969"
                  height="1248"
                />
                <div>
                  <h2>
                    Seu próximo
                    <br />
                    encontro é aqui.
                  </h2>
                  <p>Natureza, esporte, lazer e boas companhias.</p>
                  <a
                    href="#experiencias"
                    className="button button-white"
                    onClick={() => setExperience("site")}
                  >
                    Ver eventos
                    <Icon name="arrow" size={16} />
                  </a>
                </div>
              </div>
            </BrowserFrame>
            <MiniPhone />
            <span className="hero-package-label">
              Prévia do pacote app opcional
            </span>
          </div>
        </div>
      </section>
      <div className="benefit-band">
        <div className="container benefits">
          {[
            {
              icon: "users",
              title: "Um acesso para a família",
              text: "Titular e dependentes, com seus serviços reunidos.",
            },
            {
              icon: "phone",
              title: "Pacote app adicional",
              text: "Serviços no celular e ingressos exclusivos no app.",
            },
            {
              icon: "scan",
              title: "Juntos na mesma operação",
              text: "Web organiza; com o app, vendas e entradas se conectam.",
            },
          ].map((item) => (
            <div className="benefit" key={item.title}>
              <span className="benefit-icon">
                <Icon name={item.icon} size={29} />
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
