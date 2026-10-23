import { useState } from "react";
import { useDemo } from "../lib/DemoContext.jsx";
import { ticketPayload } from "../lib/model.mjs";
import { useOfflineGate } from "../lib/useOfflineGate.jsx";
import { Button, Icon, PhoneFrame, Tabs, asset } from "../components/ui.jsx";
import CameraScanner from "../components/CameraScanner.jsx";
import QrCode from "../components/QrCode.jsx";
import OfflineGateControls from "../components/OfflineGateControls.jsx";

const ready = {
  status: "ready",
  title: "Pronto para a leitura",
  detail: "Escolha um cenário ou informe o código do ingresso.",
};
export default function Gate() {
  const { state, actions } = useDemo();
  const offlineGate = useOfflineGate(state, actions);
  const [eventId, setEventId] = useState(
    () => offlineGate.list?.event.id ?? "verao",
  );
  const [scenario, setScenario] = useState("valid");
  const [result, setResult] = useState(ready);
  const [code, setCode] = useState("CCB-DEMO-001");
  const [camera, setCamera] = useState(false);
  const availableTickets = offlineGate.offline
    ? (offlineGate.list?.tickets ?? [])
    : state.tickets;
  const ticket = availableTickets.find((item) => item.eventId === eventId);
  const read = (value) => {
    setCamera(false);
    const outcome = offlineGate.offline
      ? offlineGate.scan(value, eventId)
      : actions.scan(value, eventId);
    setResult(outcome);
    setScenario(
      outcome.status === "authorized"
        ? "valid"
        : outcome.status === "used"
          ? "used"
          : "invalid",
    );
  };
  const simulate = (value) => {
    setScenario(value);
    setCamera(false);
    if (value === "invalid") {
      read("CODIGO-INVALIDO-DEMONSTRACAO");
      return;
    }
    if (!ticket || ticket.eventId !== eventId) {
      setResult({
        status: "invalid",
        title: "Nenhum ingresso emitido",
        detail:
          "Emita um ingresso para este evento na prévia do site ou aplicativo.",
      });
      return;
    }
    if (value === "used") read(ticketPayload(ticket));
    read(ticketPayload(ticket));
  };
  const checkins = offlineGate.offline
    ? (offlineGate.list?.entries.filter((item) => item.eventId === eventId)
        .length ?? 0)
    : state.checkins.filter((item) => item.eventId === eventId).length;
  return (
    <section className="section gate-section section-anchor" id="portaria">
      <div className="container gate-layout">
        <div className="gate-copy">
          <span className="investment-eyebrow">
            PACOTE APP · PORTARIA DA EQUIPE
          </span>
          <h2>
            A entrada acontece
            <br />
            pelo celular.
          </h2>
          <p>
            Disponível somente com o pacote app, fora do web básico. A equipe lê
            o QR Code e registra a entrada. Com a lista baixada antes do evento,
            a portaria continua mesmo sem internet.
          </p>
          <Tabs
            className="gate-scenarios"
            label="Cenários de leitura do ingresso"
            value={scenario}
            onChange={simulate}
            items={[
              { id: "valid", label: "Válido" },
              { id: "used", label: "Já utilizado" },
              { id: "invalid", label: "Inválido" },
            ]}
          />
          <p className="scenario-hint">
            Toque em um cenário para simular a leitura.
          </p>
          <ol className="scan-steps">
            <li>
              <span>1</span>Selecionar evento
            </li>
            <li>
              <span>2</span>Ler ingresso
            </li>
            <li>
              <span>3</span>Confirmar entrada
            </li>
          </ol>
          <OfflineGateControls
            gate={offlineGate}
            eventId={eventId}
            onChange={() => {
              setResult(ready);
              setScenario("valid");
              setCamera(false);
            }}
          />
          <div className="gate-multi">
            <Icon name="phone" size={37} />
            <div>
              <h3>Uma operação preparada.</h3>
              <p>
                Online, as entradas são validadas no servidor. Offline, o
                aparelho bloqueia a repetição na própria lista e guarda as
                entradas para sincronizar quando a conexão voltar.
              </p>
            </div>
          </div>
          <div className="connectivity-note">
            <Icon name="phone" size={28} />
            <div>
              <strong>Vários celulares offline precisam de organização.</strong>
              <span>
                Sem conexão, um celular não vê as leituras dos outros. Usar um
                aparelho offline ou dividir a lista por portaria reduz esse
                risco. Conflitos serão sinalizados ao sincronizar.
              </span>
            </div>
          </div>
          <p className="gate-demo-note">
            Nesta apresentação, lista e leituras são fictícias e ficam no
            navegador. O produto final terá armazenamento protegido no aparelho,
            acesso autorizado antes do evento e validade da lista.
          </p>
        </div>
        <div className="gate-device-column">
          <PhoneFrame
            className="gate-phone"
            label="Demonstração da portaria pelo celular"
          >
            <div className="gate-phone-header">
              <Icon name="scan" size={20} />
              <strong>Portaria</strong>
              <span
                className={`gate-connection-badge ${offlineGate.offline ? "is-offline" : ""}`}
              >
                {offlineGate.offline ? "Offline" : "Online"}
              </span>
            </div>
            <label className="gate-event-select">
              <Icon name="calendar" size={18} />
              <select
                aria-label="Evento da portaria"
                value={eventId}
                onChange={(e) => {
                  setEventId(e.target.value);
                  setScenario("valid");
                  offlineGate.setOffline(
                    offlineGate.pending > 0 &&
                      offlineGate.list?.event.id === e.target.value,
                  );
                  setResult(ready);
                  setCamera(false);
                }}
              >
                {state.events
                  .filter((item) => item.status === "published")
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </label>
            {camera ? (
              <CameraScanner onRead={read} onStop={() => setCamera(false)} />
            ) : (
              <div className="scanner-preview">
                <img src={asset("clube-lago.jpeg")} alt="" loading="lazy" />
                <QrCode
                  value={
                    ticket ? ticketPayload(ticket) : "CCB-DEMO-SEM-INGRESSO"
                  }
                  label="Exemplo de QR de ingresso para a simulação"
                />
                <div className="scan-corners" />
                <span>Prévia de leitura do ingresso</span>
              </div>
            )}
            <div className="gate-phone-body">
              <div
                className={`scan-result scan-result-${result.status}`}
                role="status"
                aria-live="polite"
              >
                <span className="scan-result-icon">
                  <Icon
                    name={
                      result.status === "authorized"
                        ? "check"
                        : result.status === "used"
                          ? "clock"
                          : result.status === "invalid"
                            ? "close"
                            : "scan"
                    }
                    size={25}
                  />
                </span>
                <strong>{result.title}</strong>
                {result.ticket && (
                  <span>
                    {result.ticket.name}
                    <small>{result.ticket.id}</small>
                  </span>
                )}
                <p>{result.detail}</p>
              </div>
              <form
                className="scan-manual"
                onSubmit={(e) => {
                  e.preventDefault();
                  read(code);
                }}
              >
                <label htmlFor="manual-ticket">Código do ingresso</label>
                <div>
                  <input
                    id="manual-ticket"
                    value={code}
                    maxLength={150}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="CCB-DEMO-001"
                    required
                  />
                  <button
                    type="submit"
                    className="small-button"
                    aria-label="Validar código do ingresso"
                  >
                    <Icon name="arrow" size={17} />
                  </button>
                </div>
              </form>
              <Button
                icon="camera"
                className="button-full"
                onClick={() => {
                  setResult(ready);
                  setCamera((previous) => !previous);
                }}
              >
                {camera ? "Desligar câmera" : "Ativar câmera"}
              </Button>
              <div className="gate-phone-foot">
                <span>
                  {checkins}{" "}
                  {checkins === 1
                    ? "entrada registrada"
                    : "entradas registradas"}
                  {offlineGate.offline && " no aparelho"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    actions.resetCheckins();
                    offlineGate.reset();
                    setResult(ready);
                    setScenario("valid");
                    setCamera(false);
                  }}
                  aria-label="Reiniciar leituras de demonstração"
                >
                  <Icon name="reset" size={14} />
                  Reiniciar
                </button>
              </div>
            </div>
          </PhoneFrame>
        </div>
      </div>
    </section>
  );
}
