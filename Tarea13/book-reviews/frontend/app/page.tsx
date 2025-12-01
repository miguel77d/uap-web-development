// app/page.tsx
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";

const STORAGE_KEY = "tarea13-chat-messages";

export default function ChatPage() {
  const [input, setInput] = useState("");

  const {
    messages,
    sendMessage,
    status,
    error,
    setMessages, // lo usamos para cargar/limpiar el historial
  } = useChat({
    // por defecto llama a /api/chat, así que no hace falta configurar más
  });

  // status nos sirve como "loading"
  const isLoading = status === "streaming" || status === "submitted";

  // 🔁 1) Al montar el componente, leemos el historial guardado
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored) as UIMessage[];

      if (Array.isArray(parsed)) {
        setMessages(parsed);
      }
    } catch (err) {
      console.warn("No se pudieron cargar mensajes guardados:", err);
    }
  }, [setMessages]);

  // 💾 2) Cada vez que cambian los mensajes, los guardamos en localStorage
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.warn("No se pudieron guardar mensajes:", err);
    }
  }, [messages]);

  // 📨 Enviar mensaje
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    const text = input.trim();
    if (!text) return;

    // API nueva: useChat ya no maneja el input,
    // usamos sendMessage y nuestro propio useState
    sendMessage({
      role: "user",
      content: text,
    });

    setInput("");
  };

  // Cómo renderizar el texto de un mensaje (API nueva usa "parts")
  const renderMessageText = (message: UIMessage) => {
    if (message.parts && message.parts.length > 0) {
      return message.parts
        .map((part) => (part.type === "text" ? part.text : ""))
        .join(" ");
    }

    // Compatibilidad: algunas versiones todavía tienen "content"
    // @ts-ignore
    return (message as any).content ?? "";
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-800/80 shadow-xl border border-slate-700 p-4 sm:p-6 flex flex-col gap-4">
        <header className="pb-2 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Chatbot – Tarea 13</h1>
            <p className="text-xs text-slate-300">
              Next.js + Vercel AI SDK + OpenRouter (API key segura en backend)
            </p>
          </div>
          {isLoading && (
            <span className="text-xs text-amber-300 animate-pulse">
              El modelo está pensando...
            </span>
          )}
        </header>

        {/* Mensajes */}
        <section className="flex-1 overflow-y-auto space-y-3 max-h-[60vh] pr-1">
          {messages.length === 0 && (
            <p className="text-sm text-slate-400">
              Empezá la conversación escribiendo un mensaje abajo 👇
            </p>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-2xl px-3 py-2 text-sm max-w-[80%] whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-700 text-slate-100"
                }`}
              >
                {renderMessageText(m as UIMessage)}
              </div>
            </div>
          ))}

          {error && (
            <p className="text-xs text-red-400">
              Ocurrió un error hablando con el modelo. Intentá de nuevo más
              tarde.
            </p>
          )}
        </section>

        {/* Input */}
        <form onSubmit={onSubmit} className="pt-2 border-t border-slate-700">
          <div className="flex items-center gap-2">
            <input
              className="flex-1 rounded-full bg-slate-900 border border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Escribí tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={2000}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 transition"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
