// app/api/chat/route.ts
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as { messages?: UIMessage[] };

    if (!messages || !Array.isArray(messages)) {
      return new Response("Formato de request inválido", { status: 400 });
    }

    // Por seguridad, por ejemplo, podés limitar a los últimos 20 mensajes:
    const safeMessages = messages.slice(-20);

    const modelId =
      process.env.OPENROUTER_MODEL ?? "anthropic/claude-3-haiku";

    const result = await streamText({
      model: openrouter(modelId),
      messages: convertToModelMessages(safeMessages),
      maxTokens: 512,
    });

    return result.toDataStreamResponse();
  } catch (err) {
    console.error("Error en /api/chat:", err);
    return new Response("Error interno del servidor", { status: 500 });
  }
}
