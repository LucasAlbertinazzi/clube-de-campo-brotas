import { Button, Icon } from "./ui.jsx";
import "./offline-gate.css";

export default function OfflineGateControls({ gate, eventId, onChange }) {
  const matching = gate.list?.event.id === eventId;
  return (
    <div className="offline-gate-controls">
      <div className="offline-gate-heading">
        <span>
          <Icon name="download" size={20} />
        </span>
        <div>
          <h3>Portaria preparada para ficar offline.</h3>
          <p>
            Online funciona normalmente. Como opção de contingência, baixe a
            lista antes do evento, leia sem internet e sincronize depois.
          </p>
        </div>
      </div>
      <ol className="offline-flow">
        <li>
          <span>1</span>Baixar lista
        </li>
        <li>
          <span>2</span>Ler offline
        </li>
        <li>
          <span>3</span>Sincronizar
        </li>
      </ol>
      <div className="offline-gate-actions">
        <Button
          variant="secondary"
          icon="download"
          disabled={gate.offline || gate.pending > 0}
          onClick={() => {
            gate.download(eventId);
            onChange();
          }}
        >
          Baixar lista do evento
        </Button>
        <Button
          variant="secondary"
          icon="phone"
          disabled={!matching || gate.offline}
          onClick={() => {
            gate.setOffline(true);
            onChange();
          }}
        >
          Simular modo offline
        </Button>
        <Button
          icon="wifi"
          disabled={!gate.list || (!gate.offline && !gate.pending)}
          onClick={() => {
            gate.sync();
            onChange();
          }}
        >
          Reconectar e sincronizar
        </Button>
      </div>
      <div className="offline-list-status" aria-live="polite">
        {gate.list ? (
          <>
            <strong>
              {gate.offline ? "Modo offline simulado" : "Lista preparada"} ·{" "}
              {gate.list.event.name}
            </strong>
            <span>
              {gate.list.tickets.length} ingresso(s) na lista · {gate.pending}{" "}
              entrada(s) pendente(s)
            </span>
            <small>
              Baixada em{" "}
              {new Date(gate.list.downloadedAt).toLocaleString("pt-BR")}. Novos
              ingressos e cancelamentos exigem atualizar a lista antes de
              desconectar.
            </small>
          </>
        ) : (
          <p>
            Selecione o evento no celular da prévia e baixe a lista para
            começar.
          </p>
        )}
      </div>
      {gate.message && (
        <p className="offline-action-message" role="status">
          {gate.message}
        </p>
      )}
      {gate.storageError && (
        <p className="offline-action-message" role="alert">
          {gate.storageError}
        </p>
      )}
      {gate.list?.entries.some((entry) => entry.status === "conflict") && (
        <ul
          className="offline-conflicts"
          aria-label="Conflitos da sincronização"
        >
          {gate.list.entries
            .filter((entry) => entry.status === "conflict")
            .map((entry) => (
              <li key={entry.id}>
                {entry.name}: {entry.reason}. Conferência manual necessária.
              </li>
            ))}
        </ul>
      )}
      <p className="offline-demo-caption">
        Prévia local com dados fictícios. Os botões simulam a conexão e a
        sincronização; não desconectam seu aparelho.
      </p>
    </div>
  );
}
