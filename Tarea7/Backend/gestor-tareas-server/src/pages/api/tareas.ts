export const prerender = false;

import fs from "fs/promises";
import path from "path";

const filePath = path.resolve("tareas.json");

// ✅ GET: Obtener tareas paginadas por tablero
export async function GET({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const tableroId = url.searchParams.get("tablero");
    const pagina = parseInt(url.searchParams.get("pagina") || "1");
    const porPagina = 5;

    if (!tableroId) {
      return new Response(JSON.stringify({ error: "Falta el tableroId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await fs.readFile(filePath, "utf-8");
    const tareasPorTablero = JSON.parse(data);
    const tareas = tareasPorTablero[tableroId] || [];

    const totalPaginas = Math.ceil(tareas.length / porPagina);
    const desde = (pagina - 1) * porPagina;
    const hasta = pagina * porPagina;

    const tareasPaginadas = tareas.slice(desde, hasta);

    return new Response(JSON.stringify({
      tareas: tareasPaginadas,
      totalPaginas,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error en GET /api/tareas:", error);
    return new Response(JSON.stringify({ error: "No se pudieron cargar las tareas" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// ✅ POST: Agregar una nueva tarea al tablero correspondiente
export async function POST({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const tableroId = url.searchParams.get("tablero");

    if (!tableroId) {
      return new Response(JSON.stringify({ error: "Falta el tableroId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { texto } = await request.json();

    if (!texto || typeof texto !== "string") {
      return new Response(JSON.stringify({ error: "Texto inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await fs.readFile(filePath, "utf-8");
    const tareasPorTablero = JSON.parse(data);

    // Si el tablero no existe, lo inicializamos
    if (!Array.isArray(tareasPorTablero[tableroId])) {
      tareasPorTablero[tableroId] = [];
    }

    const nueva = {
      id: Date.now(),
      texto,
      completada: false,
    };

    tareasPorTablero[tableroId].push(nueva);

    await fs.writeFile(filePath, JSON.stringify(tareasPorTablero, null, 2), "utf-8");

    return new Response(JSON.stringify(nueva), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en POST /api/tareas:", error);
    return new Response(JSON.stringify({ error: "No se pudo guardar la tarea" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
