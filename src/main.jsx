import React from "react";
import { createRoot } from "react-dom/client";
import { DemoProvider } from "./lib/DemoContext.jsx";
import App from "./App.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DemoProvider>
      <App />
    </DemoProvider>
  </React.StrictMode>,
);
