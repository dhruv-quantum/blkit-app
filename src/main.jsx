import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Self-hosted fonts (imported at the JS level so the bundler reliably
// resolves and copies the referenced .woff2 files — importing these inside
// a Tailwind-processed CSS file can leave the font files unbundled).
import "@fontsource/fredoka/500.css";
import "@fontsource/fredoka/600.css";
import "@fontsource/fredoka/700.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";
import "@fontsource/nunito/800.css";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
