import React from "react";
import { createRoot } from "react-dom/client";
import CommercialApp from "./CommercialApp.jsx";
import "./styles.css";
import "./sections/investment.css";
import "./sections/delivery.css";
import "./commercial.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CommercialApp />
  </React.StrictMode>,
);
