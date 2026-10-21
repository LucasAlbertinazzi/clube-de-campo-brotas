export const proposal = Object.freeze({
  date: "21/10/2026",
  exchangeRate: 6,
  implementationCents: 790000,
  monthlyCents: 249000,
  termMonths: 48,
  referenceMonthlyCents: 300000,
  developmentCents: 4900000,
  infrastructureBudgetCents: 80000,
  supportHours: 4,
});

export const infrastructure = [
  {
    name: "Servidor da aplicação",
    detail: "4 GB de RAM · 2 CPUs",
    usdCents: 2400,
    source: "https://www.digitalocean.com/pricing/droplets",
  },
  {
    name: "Banco de dados gerenciado",
    detail: "PostgreSQL · 2 GB de RAM",
    usdCents: 3045,
    source: "https://www.digitalocean.com/pricing/managed-databases",
  },
  {
    name: "Fotos e documentos",
    detail: "Spaces · franquia de 250 GiB",
    usdCents: 500,
    source: "https://docs.digitalocean.com/products/spaces/details/pricing/",
  },
  {
    name: "Backup diário do servidor",
    detail: "30% do valor do servidor",
    usdCents: 720,
    source: "https://docs.digitalocean.com/products/backups/details/pricing/",
  },
  {
    name: "Proteção e distribuição",
    detail: "Cloudflare Pro · cobrança mensal",
    usdCents: 2500,
    source: "https://www.cloudflare.com/plans/",
  },
  {
    name: "E-mails do sistema",
    detail: "Resend Pro · até 50 mil/mês",
    usdCents: 2000,
    source: "https://resend.com/pricing",
  },
];

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
export const money = (cents) => brl.format(cents / 100);
export const wholeMoney = (cents) =>
  brl.format(cents / 100).replace(/,00$/, "");

export function calculateProposal() {
  const cloudCents = infrastructure.reduce(
    (total, item) => total + item.usdCents * proposal.exchangeRate,
    0,
  );
  const developmentMonthlyCents =
    (proposal.developmentCents - proposal.implementationCents) /
    proposal.termMonths;
  const monthlySavingsCents =
    proposal.referenceMonthlyCents - proposal.monthlyCents;
  const contractTotalCents =
    proposal.implementationCents + proposal.monthlyCents * proposal.termMonths;
  return {
    cloudCents,
    reserveCents: proposal.infrastructureBudgetCents - cloudCents,
    developmentMonthlyCents,
    serviceMonthlyCents:
      proposal.monthlyCents -
      proposal.infrastructureBudgetCents -
      developmentMonthlyCents,
    monthlySavingsCents,
    savingsPercent:
      (monthlySavingsCents / proposal.referenceMonthlyCents) * 100,
    annualSavingsCents: monthlySavingsCents * 12,
    firstYearCents: proposal.implementationCents + proposal.monthlyCents * 12,
    contractTotalCents,
    contractSavingsCents:
      proposal.referenceMonthlyCents * proposal.termMonths - contractTotalCents,
  };
}
