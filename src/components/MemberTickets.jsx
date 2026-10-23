import { useRef, useState } from "react";
import { useDemo } from "../lib/DemoContext.jsx";
import {
  MEMBER_TICKETS_KEY,
  emptyMemberWallet,
  restoreMemberWallet,
  saveMemberTicket,
} from "../lib/member-tickets.mjs";
import { Button, Icon, Tabs } from "./ui.jsx";
import TicketCard from "./TicketCard.jsx";
import { memberTickets } from "../lib/visitors.mjs";
import "./member-tickets.css";

const modes = [
  { id: "online", label: "Online", icon: "wifi" },
  { id: "offline", label: "Simular offline", icon: "phone" },
];

export default function MemberTickets() {
  const { state, setAppPage } = useDemo();
  const [wallet, setWallet] = useState(() => {
    try {
      return restoreMemberWallet(localStorage.getItem(MEMBER_TICKETS_KEY));
    } catch {
      return emptyMemberWallet();
    }
  });
  const current = useRef(wallet);
  const [mode, setMode] = useState("online");
  const [selectedId, setSelectedId] = useState("CCB-DEMO-001");
  const [error, setError] = useState("");
  const offline = mode === "offline";
  const choices = offline
    ? wallet.tickets
    : memberTickets(state)
        .map((ticket) => ({
          ticket,
          event: state.events.find((event) => event.id === ticket.eventId),
        }))
        .filter((item) => item.event);
  const selected =
    choices.find((item) => item.ticket.id === selectedId) ?? choices[0];
  const saved = wallet.tickets.find(
    (item) => item.ticket.id === selected?.ticket.id,
  );
  const save = () => {
    const result = saveMemberTicket(
      current.current,
      selected?.ticket,
      selected?.event,
    );
    if (result.error) {
      setError(result.error);
      return;
    }
    try {
      localStorage.setItem(MEMBER_TICKETS_KEY, JSON.stringify(result.wallet));
      current.current = result.wallet;
      setWallet(result.wallet);
      setError("");
    } catch {
      setError(
        "Não foi possível salvar neste navegador. Continue no modo online e tente novamente.",
      );
    }
  };
  return (
    <section
      className="member-ticket-wallet"
      aria-label="Ingressos do associado"
    >
      <h3>Meus ingressos</h3>
      <Tabs
        className="member-ticket-mode"
        label="Conexão da prévia do associado"
        items={modes}
        value={mode}
        onChange={(value) => {
          setMode(value);
          setError("");
        }}
      />
      {choices.length > 1 && (
        <label className="sr-label">
          Escolha o ingresso
          <select
            className="ticket-select"
            value={selected.ticket.id}
            onChange={(event) => setSelectedId(event.target.value)}
            aria-label="Escolher ingresso no aplicativo"
          >
            {choices.map((item) => (
              <option value={item.ticket.id} key={item.ticket.id}>
                {item.ticket.name} · {item.event.name}
              </option>
            ))}
          </select>
        </label>
      )}
      {selected ? (
        <>
          {!offline && (
            <Button
              variant="secondary"
              className="member-save-ticket"
              icon="download"
              disabled={selected.ticket.status !== "available"}
              onClick={save}
            >
              {saved ? "Atualizar cópia offline" : "Salvar para usar offline"}
            </Button>
          )}
          {saved ? (
            <div className="member-saved-note" role="status">
              <Icon name="check" size={14} />
              <span>
                <strong>
                  {offline
                    ? "Sem internet · QR Code salvo"
                    : "Ingresso salvo neste aparelho"}
                </strong>
                <small>
                  Cópia de {new Date(saved.savedAt).toLocaleString("pt-BR")}
                </small>
              </span>
            </div>
          ) : (
            <p className="member-save-hint">
              Online funciona normalmente. Salvar é opcional.
            </p>
          )}
          {error && (
            <p className="member-ticket-error" role="alert">
              {error}
            </p>
          )}
          <TicketCard
            ticket={selected.ticket}
            event={selected.event}
            compact
            offlineCopy={offline}
            qrValue={offline ? selected.payload : undefined}
          />
          {offline ? (
            <p className="member-ticket-explanation">
              Apresente o mesmo QR Code na entrada. A portaria confirma a
              validade; a cópia salva não acompanha alterações posteriores.
            </p>
          ) : (
            selected.ticket.status !== "available" && (
              <p className="member-ticket-explanation">
                Somente ingressos liberados podem ser salvos. O ingresso é
                conferido na portaria.
              </p>
            )
          )}
        </>
      ) : (
        <div className="member-ticket-empty">
          <Icon name="ticket" size={28} />
          <strong>
            {offline
              ? "Nenhum ingresso salvo"
              : "Seus ingressos aparecerão aqui"}
          </strong>
          <p>
            {offline
              ? "Volte ao modo online e salve o ingresso antes de ficar sem conexão."
              : "Escolha um evento na agenda para emitir um ingresso de demonstração."}
          </p>
          {offline && (
            <Button variant="secondary" onClick={() => setMode("online")}>
              Voltar ao modo online
            </Button>
          )}
        </div>
      )}
      {!offline && (
        <button
          type="button"
          className="text-button app-agenda-link"
          onClick={() => setAppPage("home")}
        >
          Explorar a agenda
          <Icon name="arrow" size={15} />
        </button>
      )}
      <p className="member-wallet-demo">
        Prévia local com dados fictícios. O aplicativo final permitirá abrir os
        ingressos salvos sem internet.
      </p>
    </section>
  );
}
