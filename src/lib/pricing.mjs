export const proposal = Object.freeze({
  date: "21/10/2026",
  implementationCents: 790000,
  monthlyCents: 249000,
  termMonths: 48,
  supportHours: 4,
});

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
export const wholeMoney = (cents) =>
  brl.format(cents / 100).replace(/,00$/, "");
