// Commercial scope for this presentation; production authorization belongs on the server.
export const packageCapabilities = Object.freeze(
  [
    {
      id: "site",
      label: "Site, notícias, fotos e documentos",
      web: true,
      channels: ["web", "app"],
      app: "Conteúdo integrado no app",
    },
    {
      id: "members",
      label: "Associados, família e cobranças",
      web: true,
      channels: ["web", "app"],
      app: "Mesma conta e dados no celular",
    },
    {
      id: "agenda",
      label: "Agenda informativa e administração básica",
      web: true,
      channels: ["web", "app"],
      app: "Agenda conectada aos ingressos",
    },
    {
      id: "notifications",
      label: "Aplicativo Android/iOS e notificações",
      web: false,
      channels: ["app"],
      app: "Incluído no pacote app",
    },
    {
      id: "visitors",
      label: "Cadastro e login de não sócios",
      web: false,
      channels: ["app"],
      app: "Exclusivamente no app",
    },
    {
      id: "ticketPurchase",
      label: "Compra, pagamento de ingresso e QR Code",
      web: false,
      channels: ["app"],
      app: "Exclusivamente no app",
    },
    {
      id: "ticketManagement",
      label: "Valores, capacidade, inscritos e acompanhamento",
      web: false,
      channels: ["admin"],
      app: "Gestão no painel, habilitada pelo app",
    },
    {
      id: "gate",
      label: "Portaria com QR Code online/offline",
      web: false,
      channels: ["gate"],
      app: "Operação da equipe no pacote app",
    },
  ].map((item) =>
    Object.freeze({ ...item, channels: Object.freeze(item.channels) }),
  ),
);

export function allowsCapability(
  id,
  { includeMobile = false, channel = "web" } = {},
) {
  const capability = packageCapabilities.find((item) => item.id === id);
  if (!capability || !capability.channels.includes(channel)) return false;
  if (channel === "app") return includeMobile;
  return capability.web || includeMobile;
}

export const webScope = packageCapabilities
  .filter((item) => item.web)
  .map((item) => item.label);
