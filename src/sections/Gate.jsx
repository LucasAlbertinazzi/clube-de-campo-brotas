import { useState } from "react";
import { useDemo } from "../lib/DemoContext.jsx";
import { ticketPayload } from "../lib/model.mjs";
import { Button, Icon, PhoneFrame, Tabs, asset } from "../components/ui.jsx";
import CameraScanner from "../components/CameraScanner.jsx";
import QrCode from "../components/QrCode.jsx";

const ready = {
  status: "ready",
  title: "Pronto para a leitura",
  detail: "Escolha um cenário ou informe o código do ingresso.",
};
export default function Gate() {
  const { state, actions } = useDemo();
  const [eventId, setEventId] = useState("verao");
  const [scenario, setScenario] = useState("valid");
  const [result, setResult] = useState(ready);
  const [code, setCode] = useState("CCB-DEMO-001");
  const [camera, setCamera] = useState(false);
  const ticket =
    state.tickets.find((item) => item.eventId === eventId) ?? state.tickets[0];
  const read = (value) => {
    setCamera(false);
    const outcome = actions.scan(value, eventId);
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
    if (value === "used") actions.scan(ticketPayload(ticket), eventId);
    read(ticketPayload(ticket));
  };
  const checkins = state.checkins.filter(
    (item) => item.eventId === eventId,
  ).length;
  return (
    <section className="section gate-section section-anchor" id="portaria">
      <div className="container gate-layout">
        <div className="gate-copy">
          <h2>
            A entrada acontece
            <br />
            pelo celular.
          </h2>
          <p>
            A câmera lê o QR Code. O sistema confirma o ingresso e registra a
            entrada.
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
          <div className="gate-multi">
            <Icon name="phone" size={37} />
            <div>
              <h3>Uma operação mais simples.</h3>
              <p>
                No sistema final, a validação centralizada permitirá trabalhar
                com um ou mais celulares e impedir a reutilização do ingresso.
              </p>
            </div>
          </div>
          <div className="connectivity-note">
            <Icon name="wifi" size={28} />
            <div>
              <strong>Celular com câmera e conexão à internet.</strong>
              <span>
                O fluxo proposto dispensa computador e leitor dedicado na
                portaria.
              </span>
            </div>
          </div>
          <p className="gate-demo-note">
            Nesta apresentação, as leituras ficam no seu navegador. Não há
            controle de acesso real ao clube.
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
              <span className="online-dot" title="Demonstração local" />
            </div>
            <label className="gate-event-select">
              <Icon name="calendar" size={18} />
              <select
                aria-label="Evento da portaria"
                value={eventId}
                onChange={(e) => {
                  setEventId(e.target.value);
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
                </span>
                <button
                  type="button"
                  onClick={() => {
                    actions.resetCheckins();
                    setResult(ready);
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
