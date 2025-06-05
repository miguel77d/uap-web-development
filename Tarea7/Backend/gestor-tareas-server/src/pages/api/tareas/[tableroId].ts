import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.resolve('tareas.json');

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const { tableroId } = params;

  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const tareasPorTablero = JSON.parse(data);

    const tareas = tareasPorTablero[tableroId] || [];

    return new Response(JSON.stringify({ tareas, total: tareas.length }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error al leer tareas:', error);
    return new Response(JSON.stringify({ error: 'No se pudieron cargar las tareas' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
