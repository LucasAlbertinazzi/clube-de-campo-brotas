import { useEffect, useState } from "react";
import { Brand, Icon } from "./components/ui.jsx";
import Hero from "./sections/Hero.jsx";
import Experiences from "./sections/Experiences.jsx";
import AppShowcase from "./sections/AppShowcase.jsx";
import Events from "./sections/Events.jsx";
import Gate from "./sections/Gate.jsx";
import Roadmap from "./sections/Roadmap.jsx";

const links = [
  { href: "#proposta", label: "A proposta" },
  { href: "#experiencias", label: "Experiências" },
  { href: "#eventos", label: "Ingressos" },
  { href: "#implantacao", label: "Implantação" },
];
function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="main-header">
      <div className="container header-layout">
        <a
          href="#proposta"
          className="header-brand-link"
          aria-label="Clube de Campo de Brotas · início da apresentação"
        >
          <Brand />
        </a>
        <nav
          className={open ? "main-nav is-open" : "main-nav"}
          aria-label="Seções da apresentação"
          id="main-navigation"
        >
          {links.map((link) => (
            <a href={link.href} key={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a
            className="button button-primary mobile-nav-cta"
            href="#experiencias"
            onClick={() => setOpen(false)}
          >
            Explorar a proposta
            <Icon name="arrow" size={17} />
          </a>
        </nav>
        <a className="button button-primary header-cta" href="#experiencias">
          Explorar a proposta
          <Icon name="arrow" size={17} />
        </a>
        <button
          type="button"
          className="icon-button mobile-menu-toggle"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen((previous) => !previous)}
        >
          <Icon name={open ? "close" : "menu"} size={25} />
        </button>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Experiences />
        <AppShowcase />
        <Events />
        <Gate />
        <Roadmap />
      </main>
    </>
  );
}
