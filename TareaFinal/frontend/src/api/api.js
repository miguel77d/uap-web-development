// src/api/api.js

const API_URL = "http://localhost:3000/api";

/**
 * Cliente HTTP reutilizable para hablar con el backend.
 * Siempre envía cookies (credentials: "include").
 */
export async function apiFetch(path, options = {}) {
  const response = await fetch(API_URL + path, {
    credentials: "include", // envía la cookie del login
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // si no viene JSON, dejamos data en null
  }

  if (!response.ok) {
    throw {
      status: response.status,
      message: data?.error?.message || "Error desconocido"
    };
  }

  return data;
}
