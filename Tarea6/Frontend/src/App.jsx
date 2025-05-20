import React, { useEffect, useState } from "react";

function App() {
  const [tareas, setTareas] = useState([]);
  const [nueva, setNueva] = useState("");
  const [filtro, setFiltro] = useState("todas");

  useEffect(() => {
    fetch("/api/tareas")
      .then((res) => res.json())
      .then(setTareas)
      .catch((err) => console.error("Error al obtener tareas:", err));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const textoFinal = nueva.trim();
    if (!textoFinal) return;

    try {
      const res = await fetch("/api/tareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: textoFinal }),
      });

      if (!res.ok) throw new Error("Fallo el POST");

      const tareaAgregada = await res.json();
      setTareas((prev) => [...prev, tareaAgregada]);
      setNueva("");
    } catch (err) {
      console.error("Error al agregar tarea:", err);
    }
  }

  async function toggleTarea(id) {
    try {
      const res = await fetch("/api/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Error al hacer toggle");

      const actualizada = await res.json();

      setTareas((prev) =>
        prev.map((t) => (t.id === actualizada.id ? actualizada : t))
      );
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  }

  async function eliminarTarea(id) {
    try {
      const res = await fetch("/api/eliminar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Error al eliminar");

      setTareas((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
    }
  }

  async function eliminarCompletadas() {
    try {
      const res = await fetch("/api/eliminar-completadas", {
        method: "POST",
      });

      if (!res.ok) throw new Error("Error al eliminar completadas");

      setTareas((prev) => prev.filter((t) => !t.completada));
    } catch (err) {
      console.error("Error al eliminar completadas:", err);
    }
  }

  const tareasFiltradas = tareas.filter((t) => {
    if (filtro === "completadas") return t.completada;
    if (filtro === "pendientes") return !t.completada;
    return true;
  });

  return (
    <main className="min-h-screen bg-gray-900 text-white flex justify-center items-center px-4">

      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg space-y-5">
        <h1 className="text-4xl text-green-400 text-center">Gestor de tareas</h1>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            placeholder="Nueva tarea"
            className="flex-1 px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm"
          />
          <button
            type="submit"
            className="bg-blue-600 px-3 py-2 text-sm rounded-md hover:bg-blue-700 transition"
          >
            Añadir
          </button>
        </form>

        <div className="flex flex-wrap justify-between items-center gap-2 text-sm">
          <div className="space-x-1">
            {["todas", "pendientes", "completadas"].map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`px-2 py-1 rounded-md border ${
                  filtro === f
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={eliminarCompletadas}
            className="bg-red-600 px-2 py-1 text-sm rounded-md hover:bg-red-700 transition"
          >
            Eliminar completadas
          </button>
        </div>

        <ul className="space-y-2">
          {tareasFiltradas.map((tarea) => (
            <li
              key={tarea.id}
              className="flex items-center justify-between bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm"
            >
              <label className="flex items-center gap-2 w-full cursor-pointer">
                <input
                  type="checkbox"
                  checked={tarea.completada}
                  onChange={() => toggleTarea(tarea.id)}
                  className="accent-blue-500"
                />
                <span
                  className={`flex-1 ${
                    tarea.completada ? "line-through text-gray-400" : ""
                  }`}
                >
                  {tarea.texto}
                </span>
              </label>
              <button
                onClick={() => eliminarTarea(tarea.id)}
                className="text-red-400 hover:text-red-600 text-base ml-2"
                title="Eliminar"
              >
                ✖
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default App;
