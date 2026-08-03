import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Chat from "./components/Chat.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Chat />
  </StrictMode>
);
