import { useState } from "react";
import { useDemo } from "../lib/DemoContext.jsx";
import { Button, DemoNote, Icon, asset } from "./ui.jsx";
import { formatDate, formatMoney } from "../lib/model.mjs";

export default function EventForm({ onCreated }) {
  const { actions } = useDemo();
  const [form, setForm] = useState({
    name: "Encontro de Verão",
    date: "2026-12-12",
    time: "18:00",
    location: "Sede social",
    capacity: 150,
    memberPrice: 0,
    guestPrice: 40,
    audience: "members",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const set = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setSuccess(null);
  };
  const submit = (status) => {
    const result = actions.addEvent({ ...form, status });
    if (result.error) {
      setError(result.error);
      return;
    }
    setError("");
    setSuccess(result.event);
    onCreated?.(result.event);
  };
  return (
    <form
      className="event-form"
      onSubmit={(event) => {
        event.preventDefault();
        submit("published");
      }}
    >
      <div className="event-form-layout">
        <div>
          <div className="form-panel">
            <h4>Informações básicas</h4>
            <label className="field">
              Nome do evento
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
                maxLength={80}
              />
            </label>
            <div className="field-row">
              <label className="field">
                Data
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  required
                />
              </label>
              <label className="field">
                Horário
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => set("time", e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="field-row">
              <label className="field">
                Local
                <input
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  required
                  maxLength={80}
                />
              </label>
              <label className="field">
                Capacidade
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={form.capacity}
                  onChange={(e) => set("capacity", e.target.value)}
                  required
                />
              </label>
            </div>
          </div>
          <div className="form-panel">
            <h4>Ingressos</h4>
            <label className="field">
              Público do evento
              <select
                value={form.audience}
                onChange={(e) => set("audience", e.target.value)}
              >
                <option value="members">
                  Associados e convidados vinculados
                </option>
                <option value="public">Aberto a não sócios</option>
              </select>
            </label>
            <div className="field-row">
              <label className="field">
                Associado · R$
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.memberPrice}
                  onChange={(e) => set("memberPrice", e.target.value)}
                  required
                />
              </label>
              <label className="field">
                Não sócio / convidado · R$
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.guestPrice}
                  onChange={(e) => set("guestPrice", e.target.value)}
                  required
                />
              </label>
            </div>
            <p className="field-hint">Use zero para ingresso gratuito.</p>
          </div>
        </div>
        <div className="event-form-preview">
          <div className="form-panel">
            <h4>Imagem do evento</h4>
            <img
              src={asset("clube-paisagem.jpeg")}
              alt="Foto do lago do clube usada como capa de exemplo"
              loading="lazy"
            />
          </div>
          <div className="form-panel event-ticket-preview">
            <h4>Prévia do evento</h4>
            <strong>{form.name || "Nome do evento"}</strong>
            <p>
              <Icon name="calendar" size={14} />
              {form.date && !Number.isNaN(Date.parse(form.date))
                ? formatDate(form.date)
                : "Escolha uma data"}{" "}
              · {form.time}
            </p>
            <p>
              <Icon name="pin" size={14} />
              {form.location}
            </p>
            <span>
              {Number(form.memberPrice) === 0
                ? "Associado · Gratuito"
                : `Associado · ${formatMoney(Number(form.memberPrice) || 0)}`}
            </span>
          </div>
        </div>
      </div>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
      {success && (
        <div className="inline-success" role="status">
          <Icon name="success" size={18} />
          <span>
            <strong>
              {success.status === "draft"
                ? "Rascunho salvo."
                : "Evento publicado."}
            </strong>{" "}
            {success.name} aparece agora no painel
            {success.status === "published"
              ? ", no site e no aplicativo"
              : ""}{" "}
            desta demonstração.
          </span>
        </div>
      )}
      <div className="event-form-footer">
        <DemoNote>Cadastro de exemplo, sem criar eventos reais.</DemoNote>
        <div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => submit("draft")}
          >
            Salvar rascunho
          </Button>
          <Button type="submit" icon="arrow">
            Publicar evento
          </Button>
        </div>
      </div>
    </form>
  );
}
