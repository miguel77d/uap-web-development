import { NextRequest } from "next/server";
import { z } from "zod";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

// 1) Configuramos el modelo usando OpenRouter como backend
const model = openai(process.env.OPENROUTER_MODEL!, {
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_BASE_URL,
});

// 2) Definimos el esquema de parámetros de la tool searchBooks
const searchBooksParams = z.object({
  query: z.string().min(1, "La búsqueda no puede estar vacía"),
  maxResults: z.number().int().min(1).max(40).optional().default(10),
  orderBy: z.enum(["relevance", "newest"]).optional().default("relevance"),
});

// 3) Implementamos la función que realmente llama a Google Books
async function searchBooksTool(args: z.infer<typeof searchBooksParams>) {
  const { query, maxResults, orderBy } = searchBooksParams.parse(args);

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (!apiKey) {
    throw new Error("Falta GOOGLE_BOOKS_API_KEY en el backend");
  }

  const url = new URL("https://www.googleapis.com/books/v1/volumes");
  url.searchParams.set("q", query);
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("orderBy", orderBy);
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error("Error al llamar a Google Books API");
  }

  const data = await res.json();

  // Devolvemos solo lo que nos interesa para el LLM
  const books =
    data.items?.map((item: any) => {
      const volume = item.volumeInfo || {};
      return {
        id: item.id,
        title: volume.title,
        authors: volume.authors || [],
        thumbnail: volume.imageLinks?.thumbnail || null,
        description: volume.description || "",
        categories: volume.categories || [],
        pageCount: volume.pageCount || null,
        publishedDate: volume.publishedDate || null,
      };
    }) ?? [];

  return {
    total: books.length,
    books,
  };
}

// 4) Handler principal de la API
export async function POST(req: NextRequest) {
  const body = await req.json();

  const { messages } = body;

  const result = await streamText({
    model,
    messages,
    tools: {
      // Definimos la tool "searchBooks" para el LLM
      searchBooks: {
        // descripción para que el LLM sepa cuándo usarla
        description:
          "Busca libros en Google Books por título, autor, tema o palabras clave.",
        // esquema de parámetros (usando zod)
        parameters: searchBooksParams,
        // función que se ejecuta cuando el LLM decide usar esta herramienta
        execute: async (args) => {
          const data = await searchBooksTool(args);
          return data;
        },
      },
    },
    // Prompt del sistema: le explicamos al modelo qué hace este asistente
    system: `
      Sos un asistente experto en libros llamado "AI Book Advisor".
      Tu tarea es recomendar libros, explicar por qué pueden gustarle al usuario
      y usar las herramientas disponibles cuando necesites buscar o obtener
      información real de libros.

      Siempre que el usuario pida recomendaciones específicas, temas, autores,
      o géneros, deberías usar la tool "searchBooks" para consultar Google Books
      en lugar de inventar libros.
    `,
  });

  // Devolvemos la respuesta streameada al frontend
  return result.toDataStreamResponse();
}
