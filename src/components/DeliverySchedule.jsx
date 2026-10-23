import { Icon } from "./ui.jsx";
import { deliveryDays, deliveryWindows } from "../lib/pricing.mjs";

export default function DeliverySchedule({
  title,
  label,
  stages,
  mobile = false,
}) {
  return (
    <article
      className={`delivery-card${mobile ? " delivery-card-mobile" : ""}`}
    >
      <span className="investment-eyebrow">{label}</span>
      <h3>{title}</h3>
      <p className="delivery-total">
        {deliveryDays(stages)} <span>dias corridos</span>
      </p>
      <p className="delivery-result">
        {mobile
          ? "Até a conclusão do desenvolvimento, homologação e envio às lojas."
          : "Do início do projeto até a implantação web em produção."}
      </p>
      <ol className="delivery-stages">
        {deliveryWindows(stages).map((stage) => (
          <li key={stage.title}>
            <span>
              Dias {stage.startDay}–{stage.endDay}
            </span>
            <div>
              <h4>{stage.title}</h4>
              <p>{stage.text}</p>
            </div>
            <strong>{stage.days} dias</strong>
          </li>
        ))}
      </ol>
      <p className="delivery-start">
        <Icon name={mobile ? "phone" : "calendar"} size={21} />
        <span>
          {mobile
            ? "Começa após implantação e aceite web, contratação específica e liberação dos acessos necessários. A análise Apple/Google é adicional: o lançamento depende da aprovação das lojas e do aceite do clube."
            : "Começa com contratação, escopo aprovado e entrega dos conteúdos, dados e acessos necessários. Inclui migração, treinamento e teste piloto da portaria."}
        </span>
      </p>
    </article>
  );
}
