export const proposal = Object.freeze({
  date: "25/10/2026",
  implementationCents: 790000,
  monthlyCents: 350000,
  termMonths: 48,
  supportHours: 4,
});

export const mobileProposal = Object.freeze({
  optional: true,
  status: "offered",
  developmentCents: 990000,
  monthlyCents: 150000,
});

export const webDelivery = Object.freeze([
  Object.freeze({
    title: "Levantamento e aprovação",
    days: 15,
    text: "Regras, conteúdo, cadastros e integrações.",
  }),
  Object.freeze({
    title: "Desenvolvimento web",
    days: 75,
    text: "Site, portal, família, cobranças e agenda informativa. Sem ingressos.",
  }),
  Object.freeze({
    title: "Homologação web",
    days: 20,
    text: "Testes da gestão web e migração de ensaio.",
  }),
  Object.freeze({
    title: "Implantação web",
    days: 10,
    text: "Migração final, treinamento e entrada em produção.",
  }),
]);

export const mobileDelivery = Object.freeze([
  Object.freeze({
    title: "Desenvolvimento do app",
    days: 60,
    text: "Android/iOS, ingressos no app e gestão integrada no painel.",
  }),
  Object.freeze({
    title: "Homologação do app",
    days: 20,
    text: "Testes em aparelhos, compras no app e piloto da portaria online/offline.",
  }),
  Object.freeze({
    title: "Preparação e envio às lojas",
    days: 10,
    text: "Builds, materiais e submissão à Apple e ao Google.",
  }),
]);

export const deliveryDays = (stages) =>
  stages.reduce((total, stage) => total + stage.days, 0);

export const deliveryWindows = (stages) => {
  let endDay = 0;
  return stages.map((stage) => {
    const startDay = endDay + 1;
    endDay += stage.days;
    return { ...stage, startDay, endDay };
  });
};

export const recurringTotal = ({ includeMobile = false } = {}) =>
  proposal.monthlyCents + (includeMobile ? mobileProposal.monthlyCents : 0);

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
export const wholeMoney = (cents) =>
  brl.format(cents / 100).replace(/,00$/, "");
