import { useDemo } from "../lib/DemoContext.jsx";
import { BrowserFrame, Icon, SectionHeading, Tabs } from "../components/ui.jsx";
import SitePreview from "../components/SitePreview.jsx";
import MemberPanel from "../components/MemberPanel.jsx";
import AdminPanel from "../components/AdminPanel.jsx";

export default function Experiences() {
  const { experience, setExperience, demoPackage, setDemoPackage } = useDemo();
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
          description="Pacote web: site, portal do associado e administração básica. Compras e ingressos são exclusivos do app adicional."
        />
        <Tabs
          className="experience-tabs"
          value={experience}
          onChange={setExperience}
          label="Experiências da plataforma"
          items={[
            { id: "site", label: "Site do clube", icon: "home" },
            { id: "member", label: "Área do associado", icon: "users" },
            { id: "admin", label: "Administração", icon: "dashboard" },
          ]}
        />
        <p className="package-scope-note">
          <Icon name="dashboard" size={18} />
          {experience === "admin" && demoPackage === "combined"
            ? "WEB + APP · Gestão de ingressos habilitada no painel. Compras e QR Code somente no app."
            : "PACOTE WEB · Site, família, cobranças e agenda informativa. Sem ingressos ou portaria."}
        </p>
        {experience === "admin" && (
          <Tabs
            className="package-demo-tabs"
            label="Pacote demonstrado no painel"
            value={demoPackage}
            onChange={setDemoPackage}
            items={[
              { id: "web", label: "Somente web", icon: "dashboard" },
              { id: "combined", label: "Web + app", icon: "phone" },
            ]}
          />
        )}
        <BrowserFrame
          className="experience-browser"
          title={
            experience === "site"
              ? "Site do clube · Demonstração"
              : experience === "member"
                ? "Portal do associado · Demonstração"
                : demoPackage === "combined"
                  ? "Administração · Web + pacote app"
                  : "Administração · Somente web"
          }
        >
          {experience === "site" ? (
            <SitePreview />
          ) : experience === "member" ? (
            <MemberPanel />
          ) : (
            <AdminPanel key={demoPackage} />
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
