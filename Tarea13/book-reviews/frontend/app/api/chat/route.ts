// app/api/chat/route.ts

import { streamText } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";

export const runtime = "nodejs";

// Convierte los mensajes que vienen del hook useChat a un formato
// que el modelo entienda (ModelMessage[])
function uiToModelMessages(uiMessages: any[]) {
  return uiMessages.map((m) => {
    // Sacamos el texto del mensaje, soportando distintos formatos
    let text = "";

    // Formato nuevo: parts[]
    if (Array.isArray(m.parts) && m.parts.length > 0) {
      text = m.parts
        .filter((p: any) => p?.type === "text")
        .map((p: any) => String(p.text ?? ""))
        .join(" ");
    }
    // Formato viejo: content como string
    else if (typeof m.content === "string") {
      text = m.content;
    }

    return {
      role: m.role === "assistant" ? "assistant" : "user",
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages = Array.isArray(body?.messages) ? body.messages : [];

    if (messages.length === 0) {
      return new Response("No hay mensajes en la conversación.", {
        status: 400,
      });
    }

    // Por seguridad, solo mandamos los últimos 20 mensajes al modelo
    const safeMessages = messages.slice(-20);

    const modelMessages = uiToModelMessages(safeMessages);

    const modelId =
      process.env.OPENROUTER_MODEL ?? "anthropic/claude-3-haiku";

    const result = streamText({
      model: openrouter(modelId),
      messages: modelMessages,
      maxTokens: 512,
    });

    // Devolvemos el stream en formato compatible con useChat
    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("Error en /api/chat:", err);
    return new Response("Error interno del servidor", { status: 500 });
  }
}
