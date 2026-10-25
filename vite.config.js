import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  base: "./",
  build: {
    target: "es2022",
    rolldownOptions: {
      input: {
        presentation: fileURLToPath(new URL("./index.html", import.meta.url)),
        commercial: fileURLToPath(
          new URL("./comercial/index.html", import.meta.url),
        ),
      },
    },
  },
});
