import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import config from "../vite.config.js";

let server;
let App, DemoProvider, CommercialApp, PackageComparison;
const text = (markup) => markup.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
before(async () => {
  server = await createServer({
    configFile: false,
    root: fileURLToPath(new URL("../", import.meta.url)),
    logLevel: "silent",
    server: { middlewareMode: true, hmr: false, watch: null },
  });
  ({ default: App } = await server.ssrLoadModule("/src/App.jsx"));
  ({ DemoProvider } = await server.ssrLoadModule("/src/lib/DemoContext.jsx"));
  ({ default: CommercialApp } = await server.ssrLoadModule(
    "/src/CommercialApp.jsx",
  ));
  ({ default: PackageComparison } = await server.ssrLoadModule(
    "/src/components/PackageComparison.jsx",
  ));
});
after(async () => {
  await server?.close();
});

test("apresentação principal mantém demonstrações e prazos sem valores da proposta ou link comercial", () => {
  const markup = renderToStaticMarkup(
    createElement(DemoProvider, null, createElement(App)),
  );
  assert.doesNotMatch(
    text(markup),
    /R\$\s*(?:7\.900|2\.490|9\.900|3\.500|1\.500|5\.000|5\.990)/,
  );
  assert.doesNotMatch(markup, /href="[^"]*comercial/);
  assert.match(markup, /id="experiencias"/);
  assert.match(markup, /id="aplicativo"/);
  assert.match(markup, /id="seguranca"/);
  assert.match(text(markup), /120.*dias corridos/);
  assert.match(text(markup), /90.*dias corridos/);
  assert.match(text(markup), /Desenvolvido pela Nevuma Tech/);
});

test("página comercial apresenta todos os valores aprovados e a separação dos pacotes", () => {
  const markup = renderToStaticMarkup(createElement(CommercialApp));
  const content = text(markup);
  for (const amount of ["7.900", "3.500", "9.900", "1.500", "5.000"])
    assert.match(content, new RegExp(`R\\$\\s*${amount.replace(".", "\\.")}`));
  assert.match(content, /48 meses/);
  assert.doesNotMatch(content, /R\$\s*(?:2\.490|5\.990)/);
  assert.match(content, /exclusivamente no app/);
  assert.match(content, /após seu lançamento e aceite/);
  assert.match(content, /Desenvolvido pela Nevuma Tech/);
  assert.match(markup, /href="\.\.\/"/);
});

test("comparativo reutilizado só mostra valores quando explicitamente habilitado", () => {
  assert.doesNotMatch(
    text(renderToStaticMarkup(createElement(PackageComparison))),
    /R\$/,
  );
  assert.match(
    text(
      renderToStaticMarkup(
        createElement(PackageComparison, { showPrices: true }),
      ),
    ),
    /R\$\s*5\.000/,
  );
});

test("build usa dois HTMLs reais com entradas e caminhos de assets separados", async () => {
  const entries = config.build.rolldownOptions.input;
  assert.notEqual(entries.presentation, entries.commercial);
  const main = await readFile(entries.presentation, "utf8");
  const commercial = await readFile(entries.commercial, "utf8");
  assert.match(main, /src="\/src\/main\.jsx"/);
  assert.doesNotMatch(main, /commercial-main/);
  assert.match(commercial, /src="\/src\/commercial-main\.jsx"/);
  assert.match(commercial, /data-asset-base="\.\.\/"/);
  assert.match(commercial, /href="\.\.\/assets\/logo-clube\.png"/);
});
