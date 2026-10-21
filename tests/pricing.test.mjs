import test from "node:test";
import assert from "node:assert/strict";
import { calculateProposal, proposal } from "../src/lib/pricing.mjs";

test("nuvem e reserva fecham o orçamento já incluído na mensalidade", () => {
  const totals = calculateProposal();
  assert.equal(totals.cloudCents, 66990);
  assert.equal(totals.reserveCents, 13010);
  assert.equal(totals.cloudCents + totals.reserveCents, 80000);
  assert.equal(
    proposal.infrastructureBudgetCents +
      totals.developmentMonthlyCents +
      totals.serviceMonthlyCents,
    proposal.monthlyCents,
  );
});
test("entrada e parcelas recuperam a referência de desenvolvimento completo", () => {
  const totals = calculateProposal();
  assert.equal(totals.developmentMonthlyCents, 85625);
  assert.equal(
    proposal.implementationCents +
      totals.developmentMonthlyCents * proposal.termMonths,
    4900000,
  );
});
test("comparação apresenta economia recorrente sem descontar a entrada duas vezes", () => {
  const totals = calculateProposal();
  assert.equal(totals.monthlySavingsCents, 51000);
  assert.equal(totals.annualSavingsCents, 612000);
  assert.equal(totals.savingsPercent, 17);
  assert.equal(totals.firstYearCents, 3778000);
  assert.ok(totals.firstYearCents > proposal.referenceMonthlyCents * 12);
});
test("total de 48 meses inclui implantação e todas as mensalidades", () => {
  const totals = calculateProposal();
  assert.equal(totals.contractTotalCents, 12742000);
  assert.equal(totals.contractSavingsCents, 1658000);
  assert.equal(totals.serviceMonthlyCents, 83375);
});
