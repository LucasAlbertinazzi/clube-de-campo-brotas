import { useDemo } from "../lib/DemoContext.jsx";
import { BrowserFrame, Icon, SectionHeading, Tabs } from "../components/ui.jsx";
import SitePreview from "../components/SitePreview.jsx";
import MemberPanel from "../components/MemberPanel.jsx";
import AdminPanel from "../components/AdminPanel.jsx";
import VisitorPanel from "../components/VisitorPanel.jsx";

export default function Experiences() {
  const { experience, setExperience } = useDemo();
  return (
    <section id="experiencias" className="section section-anchor">
      <div className="container">
        <SectionHeading
          centered
          title={
            <>
              Cada pessoa, seu jeito
              <br className="desktop-break" /> de viver o clube.
            </>
          }
          description="Explore as telas e veja como os serviços se encontram."
        />
        <Tabs
          className="experience-tabs"
          value={experience}
          onChange={setExperience}
          label="Experiências da plataforma"
          items={[
            { id: "site", label: "Site do clube", icon: "home" },
            { id: "member", label: "Área do associado", icon: "users" },
            { id: "visitor", label: "Não sou sócio", icon: "ticket" },
            { id: "admin", label: "Administração", icon: "dashboard" },
          ]}
        />
        <BrowserFrame
          className="experience-browser"
          title={
            experience === "site"
              ? "Site do clube · Demonstração"
              : experience === "member"
                ? "Portal do associado · Demonstração"
                : experience === "visitor"
                  ? "Não sócio · Login e ingressos"
                  : "Administração · Demonstração"
          }
        >
          {experience === "site" ? (
            <SitePreview />
          ) : experience === "member" ? (
            <MemberPanel />
          ) : experience === "visitor" ? (
            <VisitorPanel />
          ) : (
            <AdminPanel />
          )}
        </BrowserFrame>
        <p className="experience-hint">
          <Icon name="menu" size={16} />
          Os menus, formulários e botões desta prévia podem ser explorados.
        </p>
      </div>
    </section>
  );
}
