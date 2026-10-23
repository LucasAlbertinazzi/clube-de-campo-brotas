export const proposal = Object.freeze({
  date: "23/10/2026",
  implementationCents: 790000,
  monthlyCents: 249000,
  termMonths: 48,
  supportHours: 4,
});

export const mobileProposal = Object.freeze({
  optional: true,
  status: "offered",
  developmentCents: 990000,
  monthlyCents: 49000,
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
    text: "Site, portal do associado, painel e portaria.",
  }),
  Object.freeze({
    title: "Homologação e piloto",
    days: 20,
    text: "Testes, migração de ensaio e evento piloto.",
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
    text: "Android e iOS integrados à plataforma web.",
  }),
  Object.freeze({
    title: "Homologação do app",
    days: 20,
    text: "Testes em aparelhos e validação com o clube.",
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
