import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import "@fontsource/poppins";

import "./styles/global.css";
import "./styles/dashboard.css";
import "./styles/sidebar.css";
import "./styles/responsive.css";
import "./styles/charts.css";
import "./styles/expenses.css";
import "./styles/planner.css";
import "./styles/summary.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
