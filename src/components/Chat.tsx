"use client";

/* ============================================================
   WIDGET CHATBOT IA — Santatra Michado
   Version React / TypeScript (chat-ia.tsx)
   Importez <ChatIA /> une seule fois dans votre layout ou page.
============================================================= */

import { useEffect, useRef, useState } from "react";

// ⚠️ Remplacez cette URL par celle de votre webhook n8n (URL de PRODUCTION, pas de test)
const WEBHOOK_URL =
  "https://n8n-jp2v.onrender.com/webhook/b4816952-f928-4b03-98ab-26eb6da37055/chat";

const WELCOME_MESSAGE =
  "Bonjour 👋 Je suis l'assistant du site de Santatra Michado. Posez-moi une question sur ses services, son portfolio ou comment le contacter !";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
};

function createId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem("sm_chat_session");
  if (!sessionId) {
    sessionId = "sm-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9);
    localStorage.setItem("sm_chat_session", sessionId);
  }
  return sessionId;
}

export default function ChatIA() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sessionId, setSessionId] = useState("");

  const messagesRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Session id côté client uniquement (évite les erreurs SSR / Next.js)
  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  // Ouvre le chat -> message de bienvenue affiché une seule fois
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ id: createId(), role: "bot", text: WELCOME_MESSAGE }]);
    }
    if (isOpen) {
      textareaRef.current?.focus();
    }
  }, [isOpen, messages.length]);

  // Auto-scroll vers le bas à chaque nouveau message
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  // Auto-resize du textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 100) + "px";
    }
  }, [input]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || isSending) return;

    setMessages((prev) => [...prev, { id: createId(), role: "user", text }]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId,
          source: "santatra-michado.site",
        }),
      });

      if (!response.ok) throw new Error("Erreur réseau : " + response.status);

      const data = await response.json();
      // Adaptez le nom du champ ci-dessous selon la sortie de votre node n8n
      // (souvent "output", "reply", "text" ou "message")
      const reply: string =
        data.output ||
        data.reply ||
        data.text ||
        data.message ||
        "Désolé, je n'ai pas pu traiter votre demande.";

      setMessages((prev) => [...prev, { id: createId(), role: "bot", text: reply }]);
    } catch (err) {
      console.error("Erreur chatbot:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "bot",
          text: "Oups, une erreur est survenue en contactant le serveur. Réessayez dans un instant.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  return (
    <>
      <style>{`
        :root {
          --sm-bg: #0d1117;
          --sm-surface: #151b23;
          --sm-accent: #5b8cff;
          --sm-accent-soft: #24314f;
          --sm-text: #e6edf3;
          --sm-text-dim: #8b98a5;
          --sm-bubble-user: #5b8cff;
          --sm-bubble-bot: #1c2431;
          --sm-radius: 16px;
        }

        #sm-chat-launcher {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--sm-accent), #7b5bff);
          box-shadow: 0 8px 24px rgba(91, 140, 255, 0.35);
          border: none;
          cursor: pointer;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        #sm-chat-launcher:hover {
          transform: scale(1.06);
          box-shadow: 0 10px 30px rgba(91, 140, 255, 0.5);
        }
        #sm-chat-launcher svg { width: 26px; height: 26px; }

        #sm-chat-window {
          position: fixed;
          bottom: 96px;
          right: 24px;
          width: 360px;
          max-width: calc(100vw - 32px);
          height: 500px;
          max-height: calc(100vh - 140px);
          background: var(--sm-surface);
          border: 1px solid #21293a;
          border-radius: var(--sm-radius);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          display: none;
          flex-direction: column;
          overflow: hidden;
          z-index: 9999;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          opacity: 0;
          transform: translateY(12px) scale(0.98);
          transition: opacity 0.18s ease, transform 0.18s ease;
        }
        #sm-chat-window.sm-open {
          display: flex;
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        #sm-chat-header {
          background: linear-gradient(120deg, var(--sm-accent-soft), #1a2333);
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid #21293a;
        }
        #sm-chat-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: linear-gradient(135deg, var(--sm-accent), #7b5bff);
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; color: white; font-size: 14px;
          flex-shrink: 0;
        }
        #sm-chat-header-text { line-height: 1.25; }
        #sm-chat-header-title { color: var(--sm-text); font-weight: 600; font-size: 14px; }
        #sm-chat-header-sub { color: var(--sm-text-dim); font-size: 12px; display: flex; align-items: center; gap: 5px; }
        #sm-chat-header-sub::before {
          content: ""; width: 6px; height: 6px; border-radius: 50%;
          background: #3ddc84; display: inline-block;
        }
        #sm-chat-close {
          margin-left: auto; background: none; border: none; cursor: pointer;
          color: var(--sm-text-dim); font-size: 20px; line-height: 1;
          padding: 4px;
          width: 20px
        }
        #sm-chat-close:hover { color: var(--sm-text); }

        #sm-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: var(--sm-bg);
        }
        #sm-chat-messages::-webkit-scrollbar { width: 5px; }
        #sm-chat-messages::-webkit-scrollbar-thumb { background: #2a3446; border-radius: 4px; }

        .sm-msg {
          max-width: 82%;
          padding: 9px 13px;
          border-radius: 14px;
          font-size: 13.5px;
          line-height: 1.45;
          word-wrap: break-word;
          animation: sm-fade-in 0.15s ease;
          white-space: pre-wrap;
        }
        @keyframes sm-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .sm-msg-bot {
          background: var(--sm-bubble-bot);
          color: var(--sm-text);
          align-self: flex-start;
          border-bottom-left-radius: 4px;
        }
        .sm-msg-user {
          background: var(--sm-bubble-user);
          color: white;
          align-self: flex-end;
          border-bottom-right-radius: 4px;
        }

        .sm-typing {
          align-self: flex-start;
          display: flex;
          gap: 4px;
          padding: 10px 14px;
          background: var(--sm-bubble-bot);
          border-radius: 14px;
          border-bottom-left-radius: 4px;
        }
        .sm-typing span {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--sm-text-dim);
          animation: sm-bounce 1.2s infinite ease-in-out;
        }
        .sm-typing span:nth-child(2) { animation-delay: 0.15s; }
        .sm-typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes sm-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-4px); opacity: 1; }
        }

        #sm-chat-input-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          border-top: 1px solid #21293a;
          background: var(--sm-surface);
        }
        #sm-chat-input {
          flex: 1;
          background: #0d1117;
          border: 1px solid #21293a;
          color: var(--sm-text);
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 13.5px;
          outline: none;
          resize: none;
          font-family: inherit;
          max-height: 100px;
          height: 100px !important;
        }
        #sm-chat-input:focus { border-color: var(--sm-accent); }
        #sm-chat-send {
          background: var(--sm-accent);
          border: none;
          width: 36px; height: 36px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.15s ease;
        }
        #sm-chat-send:hover { background: #6f9bff; }
        #sm-chat-send:disabled { background: #2a3446; cursor: not-allowed; }
        #sm-chat-send svg { width: 16px; height: 16px; }

        @media (max-width: 420px) {
          #sm-chat-window { right: 12px; bottom: 88px; width: calc(100vw - 24px); }
          #sm-chat-launcher { right: 16px; bottom: 16px; }
        }
      `}</style>

      {/* Bouton flottant */}
      <button
        id="sm-chat-launcher"
        aria-label="Ouvrir le chat"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>

      {/* Fenêtre de chat */}
      <div id="sm-chat-window" className={isOpen ? "sm-open" : ""}>
        <div id="sm-chat-header">
          <div id="sm-chat-avatar">SM</div>
          <div id="sm-chat-header-text">
            <div id="sm-chat-header-title">Assistant Santatra</div>
            <div id="sm-chat-header-sub">En ligne</div>
          </div>
          <button
            id="sm-chat-close"
            aria-label="Fermer"
            onClick={() => setIsOpen(false)}
          >
            &times;
          </button>
        </div>

        <div id="sm-chat-messages" ref={messagesRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={"sm-msg " + (msg.role === "user" ? "sm-msg-user" : "sm-msg-bot")}
            >
              {msg.text}
            </div>
          ))}
          {isSending && (
            <div className="sm-typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>

        <div id="sm-chat-input-row">
          <textarea
            id="sm-chat-input"
            ref={textareaRef}
            rows={1}
            placeholder="Écrivez votre message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            id="sm-chat-send"
            aria-label="Envoyer"
            disabled={isSending}
            onClick={() => void sendMessage()}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}