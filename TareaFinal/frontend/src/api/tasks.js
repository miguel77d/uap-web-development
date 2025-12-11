// src/api/tasks.js
import { apiFetch } from "./api";

/** GET /api/boards/:boardId/tasks → devuelve array de tareas */
export async function fetchTasks(boardId) {
  const data = await apiFetch(`/boards/${boardId}/tasks`);
  // backend devuelve { tasks: [...] }
  return data.tasks;
}

/** POST /api/boards/:boardId/tasks → crea una tarea y devuelve la tarea */
export async function createTask(boardId, payload) {
  const data = await apiFetch(`/boards/${boardId}/tasks`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
  // backend devuelve { message, task }
  return data.task;
}

/** PATCH /api/tasks/:id → actualiza la tarea */
export async function updateTask(taskId, payload) {
  const data = await apiFetch(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
  return data.task;
}

/** DELETE /api/tasks/:id */
export async function deleteTask(taskId) {
  await apiFetch(`/tasks/${taskId}`, {
    method: "DELETE"
  });
}

/** DELETE /api/boards/:boardId/tasks/completed */
export async function deleteCompletedTasks(boardId) {
  const data = await apiFetch(`/boards/${boardId}/tasks/completed`, {
    method: "DELETE"
  });
  return data.deletedCount;
}
