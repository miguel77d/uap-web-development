import type { APIRoute } from "astro";
import { readFileSync, writeFileSync, existsSync } from "fs";

export const POST: APIRoute = async ({ redirect }) => {
  let tareas = [];

  if (existsSync("./tareas.json")) {
    tareas = JSON.parse(readFileSync("./tareas.json", "utf-8"));
  }

  // Filtrar solo tareas NO completadas (o sea, eliminar las completadas)
  const tareasPendientes = tareas.filter(t => !t.completada);

  writeFileSync("./tareas.json", JSON.stringify(tareasPendientes, null, 2));

  return redirect("/", 303);
};

export const prerender = false;
