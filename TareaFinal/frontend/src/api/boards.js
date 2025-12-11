// src/api/boards.js
import { API_URL } from "./config";

// GET /api/boards
export async function fetchBoards() {
  const res = await fetch(`${API_URL}/boards`, {
    credentials: "include"
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error fetchBoards:", res.status, text);
    throw new Error(`Error al obtener tableros (${res.status})`);
  }

  const data = await res.json();
  // backend responde { boards: [...] }
  return data.boards || [];
}

// POST /api/boards
export async function createBoard(payload) {
  // payload esperado: { title, description? }
  const res = await fetch(`${API_URL}/boards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error createBoard:", res.status, text);
    throw new Error(`Error al crear tablero (${res.status})`);
  }

  const data = await res.json();
  // backend: { message, board }
  return data.board || data;
}

// PATCH /api/boards/:id
export async function updateBoard(id, payload) {
  const res = await fetch(`${API_URL}/boards/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error updateBoard:", res.status, text);
    throw new Error(`Error al actualizar tablero (${res.status})`);
  }

  const data = await res.json();
  return data.board || data;
}

// DELETE /api/boards/:id
export async function deleteBoard(id) {
  const res = await fetch(`${API_URL}/boards/${id}`, {
    method: "DELETE",
    credentials: "include"
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error deleteBoard:", res.status, text);
    throw new Error(`Error al borrar tablero (${res.status})`);
  }

  // devuelve { message: "Tablero eliminado correctamente." }
  return await res.json();
}
