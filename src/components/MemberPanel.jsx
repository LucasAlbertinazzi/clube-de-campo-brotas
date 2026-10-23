import { useState } from "react";
import { useDemo } from "../lib/DemoContext.jsx";
import { formatDate, formatMoney } from "../lib/model.mjs";
import { Avatar, Brand, Button, DemoNote, Icon, Modal, Status } from "./ui.jsx";
import PaymentModal from "./PaymentModal.jsx";

const navigation = [
  { id: "home", label: "Início", icon: "home" },
  { id: "family", label: "Minha família", icon: "users" },
  { id: "bills", label: "Cobranças", icon: "card" },
  { id: "news", label: "Comunicados", icon: "news" },
  { id: "support", label: "Atendimento", icon: "support" },
];

export function BillsView({ compact = false }) {
  const { state } = useDemo();
  const [selected, setSelected] = useState(null);
  const nextBill = state.bills.find((bill) => bill.status === "pending");
  return (
    <>
      <div className="summary-row">
        <div className="summary-box">
          <Icon name="card" />
          <span>
            Próxima mensalidade
            <strong>
              {nextBill ? formatMoney(nextBill.amount) : "Tudo em dia"}
            </strong>
          </span>
        </div>
        <div className="summary-box">
          <Icon name="calendar" />
          <span>
            Vencimento
            <strong>{nextBill ? formatDate(nextBill.dueDate) : "—"}</strong>
          </span>
        </div>
        {!compact && (
          <div className="summary-box">
            <Icon name="file" />
            <span>
              Situação
              <strong className="text-blue">
                {nextBill ? "Em aberto" : "Regular"}
              </strong>
            </span>
          </div>
        )}
      </div>
      <div className="table-scroll">
        <table className="data-table bills-table">
          <thead>
            <tr>
              <th>Referência</th>
              {!compact && <th>Vencimento</th>}
              <th>Valor</th>
              <th>Situação</th>
              <th>
                <span className="sr-only">Ação</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {state.bills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.reference}</td>
                {!compact && <td>{formatDate(bill.dueDate)}</td>}
                <td>{formatMoney(bill.amount)}</td>
                <td>
                  <Status tone={bill.status === "paid" ? "green" : "amber"}>
                    {bill.status === "paid" ? "Pago" : "Em aberto"}
                  </Status>
                </td>
                <td>
                  <button
                    type="button"
                    className={
                      bill.status === "pending" ? "small-button" : "text-button"
                    }
                    onClick={() => setSelected(bill)}
                  >
                    {bill.status === "pending" ? "Ver pagamento" : "Detalhes"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DemoNote>Nenhum pagamento real é realizado nesta prévia.</DemoNote>
      {selected &&
        (selected.status === "pending" ? (
          <PaymentModal bill={selected} onClose={() => setSelected(null)} />
        ) : (
          <Modal title="Pagamento registrado" onClose={() => setSelected(null)}>
            <div className="payment-preview">
              <Icon name="success" size={44} />
              <h3>{selected.reference}</h3>
              <strong>{formatMoney(selected.amount)}</strong>
              <p>
                Este registro faz parte do histórico fictício da demonstração.
              </p>
            </div>
          </Modal>
        ))}
    </>
  );
}

export function FamilyView({ compact = false }) {
  const { state, actions } = useDemo();
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [showRecord, setShowRecord] = useState(false);
  return (
    <>
      <div className={`family-list ${compact ? "family-list-compact" : ""}`}>
        {state.family.map((person) => (
          <div className="family-person" key={person.id}>
            <Avatar person={person} />
            <div>
              <strong>{person.name}</strong>
              <span>{person.relationship}</span>
            </div>
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setName(person.name);
                setEditing(person);
              }}
            >
              Editar
            </button>
          </div>
        ))}
      </div>
      {!compact && (
        <>
          <Button
            variant="secondary"
            icon="file"
            onClick={() => setShowRecord(true)}
          >
            Ver ficha cadastral
          </Button>
          <DemoNote>
            Titular e dependentes vinculados ao mesmo título familiar.
          </DemoNote>
        </>
      )}
      {editing && (
        <Modal
          title="Editar cadastro de demonstração"
          onClose={() => setEditing(null)}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (actions.updateFamily(editing.id, name)) setEditing(null);
            }}
          >
            <label className="field">
              Nome de exemplo
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={60}
                required
              />
            </label>
            <p className="muted">
              Use apenas informações fictícias nesta apresentação pública.
            </p>
            <Button type="submit" className="button-full">
              Salvar alteração
            </Button>
          </form>
        </Modal>
      )}
      {showRecord && (
        <Modal
          title="Ficha cadastral demonstrativa"
          onClose={() => setShowRecord(false)}
        >
          <p className="muted">Título familiar 00124 · Dados fictícios</p>
          {state.family.map((person) => (
            <div className="record-row" key={person.id}>
              <strong>{person.name}</strong>
              <span>{person.relationship}</span>
            </div>
          ))}
          <DemoNote>
            Esta ficha não representa um cadastro real do clube.
          </DemoNote>
        </Modal>
      )}
    </>
  );
}

export function SupportView() {
  const { state, actions } = useDemo();
  const [subject, setSubject] = useState("Informações sobre um evento");
  const [message, setMessage] = useState(
    "Gostaria de saber mais sobre a programação.",
  );
  return (
    <>
      <form
        className="support-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (actions.sendMessage(subject, message)) setMessage("");
        }}
      >
        <label className="field">
          Assunto
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            maxLength={80}
            required
          />
        </label>
        <label className="field">
          Mensagem
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={1000}
            rows={3}
            required
          />
        </label>
        <Button icon="mail" type="submit">
          Simular envio
        </Button>
      </form>
      {state.messages.length > 0 && (
        <div className="message-history">
          <h4>Solicitações desta demonstração</h4>
          {state.messages.map((item) => (
            <div className="record-row" key={item.id}>
              <span>{item.subject}</span>
              <Status tone="green">{item.status}</Status>
            </div>
          ))}
        </div>
      )}
      <DemoNote>O formulário não envia mensagens para a secretaria.</DemoNote>
    </>
  );
}

export default function MemberPanel() {
  const { state, memberPage, setMemberPage } = useDemo();
  const current =
    navigation.find((item) => item.id === memberPage) ?? navigation[2];
  return (
    <div className="product-shell">
      <aside className="product-sidebar">
        <Brand compact />
        <nav aria-label="Menu da área do associado">
          {navigation.map((item) => (
            <button
              type="button"
              key={item.id}
              className={memberPage === item.id ? "is-active" : ""}
              onClick={() => setMemberPage(item.id)}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <Icon name="shield" size={16} />
          <span>Acesso do associado</span>
        </div>
      </aside>
      <div className="product-main">
        <div className="product-topbar">
          <span>
            Título familiar <strong>00124</strong>
          </span>
          <span className="profile-inline">
            <Avatar person={state.family[0]} size="small" />
            <span>
              {state.family[0].name}
              <small>Associada titular</small>
            </span>
            <Icon name="down" size={16} />
          </span>
        </div>
        <div className="product-content">
          <div className="product-title">
            <h3>{current.label}</h3>
            <p>
              {
                {
                  home: "Que bom ter você por aqui.",
                  family: "Sua família, com os dados sempre por perto.",
                  bills: "Mensalidades e pagamentos em um só lugar.",
                  news: "As novidades e os avisos do clube.",
                  support: "Um canal direto com a secretaria.",
                }[memberPage]
              }
            </p>
          </div>
          {memberPage === "bills" && <BillsView />}
          {memberPage === "family" && <FamilyView />}
          {memberPage === "support" && <SupportView />}
          {memberPage === "news" && (
            <div className="notice-list">
              {state.posts.map((post) => (
                <article key={post.id}>
                  <Icon name="news" size={22} />
                  <div>
                    <h4>{post.title}</h4>
                    <p>{post.body}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
          {memberPage === "home" && (
            <>
              <div className="welcome-banner">
                <h4>O clube mais perto da sua família</h4>
                <p>Confira seus serviços e aproveite o próximo encontro.</p>
                <Button icon="card" onClick={() => setMemberPage("bills")}>
                  Consultar cobranças
                </Button>
              </div>
              <div className="quick-links">
                {navigation.slice(1).map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setMemberPage(item.id)}
                  >
                    <Icon name={item.icon} size={26} />
                    <span>{item.label}</span>
                    <Icon name="next" size={16} />
                  </button>
                ))}
              </div>
              <DemoNote />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
