import { useState } from "react";
import { useDemo } from "../lib/DemoContext.jsx";
import { shortDate } from "../lib/model.mjs";
import { Brand, Button, DemoNote, Icon, Modal, asset } from "./ui.jsx";

export default function SitePreview() {
  const { state, setExperience, setMemberPage } = useDemo();
  const [view, setView] = useState("home");
  const [photo, setPhoto] = useState(null);
  const published = state.events.filter((item) => item.status === "published");
  const enter = () => {
    setExperience("member");
    setMemberPage("bills");
  };
  return (
    <div className="site-preview">
      <div className="site-preview-nav">
        <Brand compact />
        <nav aria-label="Menu da prévia do site">
          {[
            { id: "home", label: "O clube" },
            { id: "events", label: "Eventos" },
            { id: "photos", label: "Fotos" },
            { id: "news", label: "Notícias" },
          ].map((item) => (
            <button
              type="button"
              key={item.id}
              className={view === item.id ? "is-active" : ""}
              onClick={() => setView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <Button className="small-button" onClick={enter}>
          Área do associado
        </Button>
      </div>
      {view === "home" && (
        <>
          <div className="site-preview-hero">
            <img
              src={asset("clube-paisagem.jpeg")}
              alt="Lago e paisagem do Clube de Campo de Brotas"
              loading="lazy"
            />
            <div className="site-preview-hero-copy">
              <h3>
                Seu próximo
                <br />
                encontro é aqui.
              </h3>
              <p>Natureza, esporte, lazer e boas companhias.</p>
              <Button
                variant="white"
                icon="arrow"
                onClick={() => setView("events")}
              >
                Ver eventos
              </Button>
            </div>
          </div>
          <div className="site-story">
            <div>
              <h4>Um lugar para viver bons momentos</h4>
              <p>
                Uma nova forma de acompanhar o clube: programação, fotos e
                serviços, no computador e no celular.
              </p>
              <p className="site-visitor-link">
                Agenda informativa no web. Ingressos e cadastro de não sócios
                somente no app opcional.
              </p>
              <a className="text-button" href="#aplicativo">
                Conhecer o pacote app <Icon name="arrow" size={17} />
              </a>
            </div>
            <div className="site-story-links">
              <a
                className="document-link"
                href="https://www.clubedecampodebrotas.com.br/o-clube/"
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="file" />
                Estatuto e regimento
                <Icon name="external" size={16} />
              </a>
              <button type="button" onClick={() => setView("events")}>
                <Icon name="calendar" />
                Programação
                <Icon name="next" size={16} />
              </button>
              <button type="button" onClick={() => setView("photos")}>
                <Icon name="image" />
                Nossas paisagens
                <Icon name="next" size={16} />
              </button>
            </div>
          </div>
        </>
      )}
      {view === "events" && (
        <div className="site-preview-content">
          <div className="product-title">
            <h3>Vamos nos encontrar?</h3>
            <p>
              Agenda informativa ilustrativa. Consulte a programação do clube. O
              web não oferece compra, emissão ou exibição de ingressos.
            </p>
          </div>
          <div className="event-cards">
            {published.map((item) => (
              <article className="event-card" key={item.id}>
                <img
                  src={asset(item.image)}
                  alt="Paisagem do clube usada na demonstração"
                  loading="lazy"
                />
                <div>
                  <span className="event-category">
                    {item.category} · {shortDate(item.date)}
                  </span>
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <p className="site-public-price">
                    {item.location} · {item.time}
                  </p>
                  <span className="event-category">
                    {item.audience === "public"
                      ? "Evento aberto ao público"
                      : "Evento de associados"}
                  </span>
                </div>
              </article>
            ))}
          </div>
          <DemoNote>
            Os eventos, datas e preços desta agenda são fictícios.
          </DemoNote>
        </div>
      )}
      {view === "photos" && (
        <div className="site-preview-content">
          <div className="product-title">
            <h3>Nossas paisagens</h3>
            <p>Fotos originais do site atual do Clube de Campo de Brotas.</p>
          </div>
          <div className="photo-gallery">
            {["clube-paisagem.jpeg", "clube-lago.jpeg"].map((file, index) => (
              <button
                type="button"
                onClick={() => setPhoto(file)}
                key={file}
                aria-label={`Ampliar foto ${index + 1} do clube`}
              >
                <img
                  src={asset(file)}
                  alt={
                    index === 0
                      ? "Lago do clube"
                      : "Pergolado e área de convivência do clube"
                  }
                  loading="lazy"
                />
                <span>
                  Ampliar foto
                  <Icon name="external" size={16} />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      {view === "news" && (
        <div className="site-preview-content">
          <div className="product-title">
            <h3>Novidades do clube</h3>
            <p>
              Exemplos de publicações gerenciadas pelo painel administrativo.
            </p>
          </div>
          <div className="news-list">
            {state.posts.map((post) => (
              <article key={post.id}>
                <img
                  src={asset(post.image)}
                  alt="Paisagem do clube"
                  loading="lazy"
                />
                <div>
                  <h4>{post.title}</h4>
                  <p>{post.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
      {photo && (
        <Modal title="Paisagens do clube" wide onClose={() => setPhoto(null)}>
          <img
            className="gallery-expanded"
            src={asset(photo)}
            alt="Foto original do Clube de Campo de Brotas"
          />
        </Modal>
      )}
    </div>
  );
}
