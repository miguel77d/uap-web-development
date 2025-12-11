// src/components/TasksPanel.jsx
import { useEffect, useState } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  deleteCompletedTasks
} from "../api/tasks";

export function TasksPanel({ boardId }) {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Cargar tareas cuando cambia el tablero
  useEffect(() => {
    if (!boardId) return;

    fetchTasks(boardId)
      .then((tasksFromApi) => {
        setTasks(tasksFromApi);
      })
      .catch((err) => {
        console.error("Error cargando tareas:", err);
      });
  }, [boardId]);

  async function handleCreateTask(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const task = await createTask(boardId, {
        title: newTitle,
        description: newDescription
      });

      setTasks((prev) => [task, ...prev]);
      setNewTitle("");
      setNewDescription("");
    } catch (error) {
      console.error("Error creando tarea:", error);
    }
  }

  async function handleToggleCompleted(task) {
    try {
      const updated = await updateTask(task.id, {
        completed: !task.completed
      });

      setTasks((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
    } catch (error) {
      console.error("Error actualizando tarea:", error);
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("Error eliminando tarea:", error);
    }
  }

  async function handleClearCompleted() {
    try {
      const deletedCount = await deleteCompletedTasks(boardId);
      console.log("Tareas completadas eliminadas:", deletedCount);
      setTasks((prev) => prev.filter((t) => !t.completed));
    } catch (error) {
      console.error("Error eliminando tareas completadas:", error);
    }
  }

  if (!boardId) {
    return <p style={{ color: "yellow" }}>Elegí un tablero para ver sus tareas.</p>;
  }

  return (
    <div style={{ color: "white" }}>
      <h2>Tareas del tablero {boardId}</h2>

      <form
        onSubmit={handleCreateTask}
        style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
      >
        <input
          type="text"
          placeholder="Título de la tarea"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Descripción (opcional)"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button type="submit">Agregar tarea</button>
      </form>

      {tasks.length === 0 ? (
        <p>No hay tareas aún.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <label>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleCompleted(task)}
                />
                <strong>{task.title}</strong>{" "}
                {task.description && <span>– {task.description}</span>}
              </label>
              <button onClick={() => handleDeleteTask(task.id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}

      <button onClick={handleClearCompleted}>
        Eliminar tareas completadas
      </button>
    </div>
  );
}
