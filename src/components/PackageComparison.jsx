import { Icon } from "./ui.jsx";
import { packageCapabilities } from "../lib/packages.mjs";
import {
  proposal,
  mobileProposal,
  recurringTotal,
  wholeMoney,
} from "../lib/pricing.mjs";

export default function PackageComparison() {
  return (
    <article
      className="package-comparison"
      aria-labelledby="package-comparison-title"
    >
      <span className="investment-eyebrow">
        DOIS PACOTES, FUNÇÕES COMPLEMENTARES
      </span>
      <h3 id="package-comparison-title">
        O web organiza. O app aproxima e conecta aos eventos.
      </h3>
      <p>
        Comece pela gestão do clube. Ao contratar o app, acrescente a
        experiência mobile e todo o módulo de ingressos. Não há compra nem
        exibição de ingresso no site ou no portal.
      </p>
      <div className="table-scroll">
        <table className="data-table package-table">
          <thead>
            <tr>
              <th scope="col">Recurso</th>
              <th scope="col">
                Somente web
                <br />
                <strong>{wholeMoney(proposal.monthlyCents)}/mês</strong>
              </th>
              <th scope="col">
                Com o pacote app
                <br />
                <strong>+ {wholeMoney(mobileProposal.monthlyCents)}/mês</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            {packageCapabilities.map((item) => (
              <tr key={item.id}>
                <th scope="row">{item.label}</th>
                <td data-label="Web">
                  {item.web ? "Incluído" : "Não incluído"}
                </td>
                <td data-label="App adicional">{item.app}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="package-journey">
        <div>
          <Icon name="dashboard" />
          <strong>1. A equipe organiza no web</strong>
          <p>
            Cadastros, família, cobranças, conteúdo e agenda em uma base de
            gestão.
          </p>
        </div>
        <div>
          <Icon name="phone" />
          <strong>2. O público participa no app</strong>
          <p>
            Associados acessam os serviços da família; não sócios têm conta
            própria para eventos abertos. Compras e ingressos ficam somente no
            app.
          </p>
        </div>
        <div>
          <Icon name="scan" />
          <strong>3. O clube acompanha a operação</strong>
          <p>
            Com o pacote app, a equipe gerencia ingressos no painel e valida o
            QR na portaria. Vendas e entradas alimentam a mesma operação.
          </p>
        </div>
      </div>
      <p className="package-total">
        <strong>
          Web + app: {wholeMoney(recurringTotal({ includeMobile: true }))}/mês
          após os respectivos aceites.
        </strong>{" "}
        O app é adicional à base web e tem implantação e cronograma próprios. Só
        web não habilita ingressos nem portaria.
      </p>
    </article>
  );
}
