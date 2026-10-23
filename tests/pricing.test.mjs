import test from "node:test";
import assert from "node:assert/strict";
import {
  proposal,
  mobileProposal,
  wholeMoney,
  recurringTotal,
  webDelivery,
  mobileDelivery,
  deliveryDays,
  deliveryWindows,
} from "../src/lib/pricing.mjs";

test("pacote web mantém os valores comerciais e a vigência aprovados", () => {
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

test("contratação web não cobra o app opcional automaticamente", () => {
  assert.equal(mobileProposal.optional, true);
  assert.equal(mobileProposal.status, "offered");
  assert.equal(recurringTotal(), 249000);
  assert.equal(recurringTotal({ includeMobile: false }), 249000);
  assert.equal(recurringTotal({ includeMobile: true }), 298000);
  assert.equal(
    wholeMoney(mobileProposal.developmentCents).replace(/\s/g, " "),
    "R$ 9.900",
  );
  assert.equal(
    wholeMoney(mobileProposal.monthlyCents).replace(/\s/g, " "),
    "R$ 490",
  );
});

test("estimativa web inclui homologação e implantação dentro dos 120 dias", () => {
  const windows = deliveryWindows(webDelivery);
  assert.equal(deliveryDays(webDelivery), 120);
  assert.deepEqual(
    windows.map(({ startDay, endDay }) => [startDay, endDay]),
    [
      [1, 15],
      [16, 90],
      [91, 110],
      [111, 120],
    ],
  );
  assert.equal(windows.at(-1).title, "Implantação web");
});

test("estimativa mobile tem contagem própria e termina no envio às lojas", () => {
  const windows = deliveryWindows(mobileDelivery);
  assert.equal(deliveryDays(mobileDelivery), 90);
  assert.deepEqual(
    windows.map(({ startDay, endDay }) => [startDay, endDay]),
    [
      [1, 60],
      [61, 80],
      [81, 90],
    ],
  );
  assert.equal(windows.at(-1).title, "Preparação e envio às lojas");
});

test("cálculo de etapas não altera a entrada nem acumula dias entre chamadas", () => {
  const stages = [
    { title: "A", days: 2 },
    { title: "B", days: 3 },
  ];
  const original = structuredClone(stages);
  const expected = [
    { title: "A", days: 2, startDay: 1, endDay: 2 },
    { title: "B", days: 3, startDay: 3, endDay: 5 },
  ];
  assert.deepEqual(deliveryWindows(stages), expected);
  assert.deepEqual(deliveryWindows(stages), expected);
  assert.deepEqual(stages, original);
  assert.equal(deliveryDays([]), 0);
  assert.deepEqual(deliveryWindows([]), []);
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
