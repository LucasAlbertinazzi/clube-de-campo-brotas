import test from "node:test";
import assert from "node:assert/strict";
import { proposal, wholeMoney } from "../src/lib/pricing.mjs";

test("proposta apresenta os valores comerciais e o prazo aprovados", () => {
  assert.equal(
    wholeMoney(proposal.implementationCents).replace(/\s/g, " "),
    "R$ 7.900",
  );
  assert.equal(
    wholeMoney(proposal.monthlyCents).replace(/\s/g, " "),
    "R$ 2.490",
  );
  assert.equal(proposal.termMonths, 48);
});

test("dados publicados da proposta se limitam às condições comerciais", () => {
  const publicFields = new Set([
    "date",
    "implementationCents",
    "monthlyCents",
    "termMonths",
    "supportHours",
  ]);
  for (const field of Object.keys(proposal)) {
    assert.ok(
      publicFields.has(field),
      "Campo fora do escopo comercial: " + field,
    );
  }
});
