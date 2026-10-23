import test from "node:test";
import assert from "node:assert/strict";
import { allowsCapability, webScope } from "../src/lib/packages.mjs";

test("web sozinho oferece gestão e agenda, sem funcionalidades de ingressos", () => {
  for (const id of ["site", "members", "agenda"])
    assert.equal(allowsCapability(id), true);
  for (const id of [
    "visitors",
    "ticketPurchase",
    "ticketManagement",
    "gate",
    "notifications",
  ]) {
    for (const channel of ["web", "app", "admin", "gate"])
      assert.equal(allowsCapability(id, { channel }), false);
  }
  assert.equal(webScope.length, 3);
});

test("nem o pacote combinado permite compra ou acesso de visitante pelo navegador", () => {
  for (const id of ["ticketPurchase", "visitors"]) {
    assert.equal(
      allowsCapability(id, { includeMobile: true, channel: "app" }),
      true,
    );
    for (const channel of ["web", "admin", "gate"])
      assert.equal(
        allowsCapability(id, { includeMobile: true, channel }),
        false,
      );
  }
});

test("gestão e portaria precisam do pacote app e usam suas superfícies operacionais", () => {
  assert.equal(
    allowsCapability("ticketManagement", {
      includeMobile: true,
      channel: "admin",
    }),
    true,
  );
  assert.equal(
    allowsCapability("gate", { includeMobile: true, channel: "gate" }),
    true,
  );
  assert.equal(allowsCapability("gate", { channel: "gate" }), false);
  assert.equal(
    allowsCapability("ticketManagement", { channel: "admin" }),
    false,
  );
  assert.equal(
    allowsCapability("ticketPurchase", {
      includeMobile: true,
      channel: "admin",
    }),
    false,
  );
});

test("app amplia os serviços web após contratação sem habilitar recursos desconhecidos", () => {
  assert.equal(allowsCapability("members", { channel: "app" }), false);
  assert.equal(
    allowsCapability("members", { includeMobile: true, channel: "app" }),
    true,
  );
  assert.equal(allowsCapability("members", { includeMobile: true }), true);
  assert.equal(
    allowsCapability("unknown", { includeMobile: true, channel: "app" }),
    false,
  );
});
