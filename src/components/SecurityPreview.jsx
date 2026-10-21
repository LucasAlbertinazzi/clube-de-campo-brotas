import { useId, useState } from "react";
import { Brand, Button, Icon, Tabs } from "./ui.jsx";

export default function SecurityPreview() {
  const [channel, setChannel] = useState("web");
  const [step, setStep] = useState("password");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const inputId = useId();
  const reset = () => {
    setStep("password");
    setCode("");
    setError("");
  };
  return (
    <div className="security-preview">
      <div className="security-preview-top">
        <Brand compact />
        <span>Prévia de acesso</span>
      </div>
      <Tabs
        label="Canal da simulação de acesso"
        value={channel}
        onChange={(value) => {
          setChannel(value);
          reset();
        }}
        items={[
          { id: "web", label: "Portal web", icon: "home" },
          { id: "app", label: "Aplicativo", icon: "phone" },
        ]}
      />
      <div className="auth-preview-body">
        <span
          className={`auth-symbol ${step === "authorized" ? "auth-symbol-success" : ""}`}
        >
          <Icon name={step === "authorized" ? "success" : "shield"} size={30} />
        </span>
        <p className="investment-eyebrow">
          {channel === "web"
            ? "PORTAL DO ASSOCIADO"
            : "APLICATIVO ANDROID / IOS"}
        </p>
        <h3>
          {step === "authorized"
            ? "Acesso confirmado"
            : step === "code"
              ? "Confirme que é você"
              : "Uma camada a mais de proteção."}
        </h3>
        {step === "password" ? (
          <>
            <p>
              Depois da senha, um código temporário confirma a identidade de
              quem está entrando.
            </p>
            <Button
              className="button-full"
              icon="arrow"
              onClick={() => setStep("code")}
            >
              Simular login com senha
            </Button>
          </>
        ) : step === "code" ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (code === "123456") {
                setStep("authorized");
                setError("");
              } else setError("Código incorreto. Nesta simulação, use 123456.");
            }}
          >
            <p>
              No produto final, o código virá do aplicativo autenticador
              cadastrado pela pessoa.
            </p>
            <label htmlFor={inputId}>Código de verificação</label>
            <input
              id={inputId}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={6}
              pattern="[0-9]{6}"
              required
              value={code}
              onChange={(event) => {
                setCode(event.target.value.replace(/\D/g, ""));
                setError("");
              }}
              placeholder="000000"
              aria-describedby={`${inputId}-hint${error ? ` ${inputId}-error` : ""}`}
              aria-invalid={Boolean(error)}
            />
            <p className="auth-code-hint" id={`${inputId}-hint`}>
              Código fictício para testar: <strong>123456</strong>
            </p>
            {error && (
              <p className="auth-error" id={`${inputId}-error`} role="alert">
                {error}
              </p>
            )}
            <Button className="button-full" type="submit" icon="shield">
              Confirmar código
            </Button>
          </form>
        ) : (
          <div className="auth-success" role="status">
            <p>
              Senha e segundo fator verificados na prévia do{" "}
              {channel === "web" ? "portal" : "aplicativo"}.
            </p>
            <Button
              variant="secondary"
              className="button-full"
              icon="reset"
              onClick={reset}
            >
              Reiniciar simulação
            </Button>
          </div>
        )}
        <div
          className="auth-progress"
          aria-label={`Etapa ${step === "password" ? 1 : step === "code" ? 2 : 3} de 3`}
        >
          <span className="is-complete">1 · Senha</span>
          <i />
          <span className={step !== "password" ? "is-complete" : ""}>
            2 · Código
          </span>
          <i />
          <span className={step === "authorized" ? "is-complete" : ""}>
            3 · Acesso
          </span>
        </div>
      </div>
      <p className="auth-demo-note">
        <Icon name="file" size={15} />
        Simulação ilustrativa. Não habilita autenticação real e não solicita sua
        senha.
      </p>
    </div>
  );
}
