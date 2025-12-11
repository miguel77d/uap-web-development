// src/pages/BoardsPage.jsx
import { useEffect, useState } from "react";
import {
  fetchBoards,
  createBoard,
  updateBoard,
  deleteBoard
} from "../api/boards";
import { TasksPanel } from "../components/TasksPanel";

export default function BoardsPage() {
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(null);

  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [editBoardTitle, setEditBoardTitle] = useState("");

  // 🔹 Cargar tableros reales al entrar
  useEffect(() => {
    fetchBoards()
      .then((boardsFromApi) => {
        // boardsFromApi ya es un array (api/boards.js hace res.boards)
        setBoards(boardsFromApi);

        if (boardsFromApi.length > 0) {
          const first = boardsFromApi[0];
          setSelectedBoardId(first.id);
          setEditBoardTitle(first.title ?? first.name ?? "");
        }
      })
      .catch((err) => {
        console.error("Error cargando boards:", err);
      });
  }, []);

  /* -------------------- Crear tablero -------------------- */

  async function handleCreateBoard(e) {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;

    try {
      // el backend espera { title }
      const board = await createBoard({ title: newBoardTitle.trim() });

      setBoards((prev) => [...prev, board.board ?? board]); // por si api devuelve { board }
      setNewBoardTitle("");

      const created = board.board ?? board;

      if (!selectedBoardId && created?.id) {
        setSelectedBoardId(created.id);
        setEditBoardTitle(created.title ?? "");
      }
    } catch (error) {
      console.error("Error creando board:", error);
    }
  }

  /* -------------------- Seleccionar tablero -------------------- */

  function handleSelectBoard(board) {
    setSelectedBoardId(board.id);
    setEditBoardTitle(board.title ?? board.name ?? "");
  }

  const selectedBoard =
    boards.find((b) => b.id === selectedBoardId) || null;

  /* -------------------- Renombrar tablero -------------------- */

  async function handleRenameBoard(e) {
    e.preventDefault();
    if (!selectedBoardId || !editBoardTitle.trim()) return;

    try {
      const res = await updateBoard(selectedBoardId, {
        title: editBoardTitle.trim()
      });

      const updated = res.board ?? res;

      setBoards((prev) =>
        prev.map((b) => (b.id === updated.id ? { ...b, ...updated } : b))
      );
    } catch (error) {
      console.error("Error renombrando tablero:", error);
    }
  }

  /* -------------------- Borrar tablero -------------------- */

  async function handleDeleteBoard() {
    if (!selectedBoardId) return;

    // si querés, después le agregamos un confirm
    try {
      await deleteBoard(selectedBoardId);

      setBoards((prev) => prev.filter((b) => b.id !== selectedBoardId));

      // elegir otro tablero si queda alguno
      setTimeout(() => {
        setBoards((current) => {
          if (current.length === 0) {
            setSelectedBoardId(null);
            setEditBoardTitle("");
            return current;
          }

          const next = current[0];
          setSelectedBoardId(next.id);
          setEditBoardTitle(next.title ?? next.name ?? "");
          return current;
        });
      }, 0);
    } catch (error) {
      console.error("Error borrando tablero:", error);
    }
  }

  return (
    <div
      style={{
        padding: "2rem",
        minHeight: "100vh",
        background: "#111",
        color: "white"
      }}
    >
      <h1 style={{ fontSize: "3rem", fontWeight: "bold", color: "red" }}>
        MIS TABLEROS DEBUG
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "2rem",
          marginTop: "2rem"
        }}
      >
        {/* IZQUIERDA: tableros reales */}
        <section>
          <h2>Tableros (backend)</h2>

          {/* Crear tablero */}
          <form
            onSubmit={handleCreateBoard}
            style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
          >
            <input
              placeholder="Nombre del tablero"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              style={{ flex: 1, padding: "0.5rem" }}
            />
            <button type="submit">Crear tablero</button>
          </form>

          {/* Lista de tableros */}
          {boards.length === 0 ? (
            <p>No tenés tableros aún.</p>
          ) : (
            <ul>
              {boards.map((board) => (
                <li key={board.id}>
                  <button
                    onClick={() => handleSelectBoard(board)}
                    style={{
                      background:
                        board.id === selectedBoardId ? "white" : "transparent",
                      color:
                        board.id === selectedBoardId ? "black" : "inherit",
                      border: "none",
                      cursor: "pointer",
                      fontWeight:
                        board.id === selectedBoardId ? "bold" : "normal",
                      padding: "0.3rem 0.6rem",
                      borderRadius: "999px",
                      marginBottom: "0.25rem"
                    }}
                  >
                    {/* Usamos title (o name como fallback por si quedó algo viejo) */}
                    {board.title ?? board.name} (id: {board.id})
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p style={{ marginTop: "1rem" }}>
            Tablero seleccionado: {String(selectedBoardId)}
          </p>
        </section>

        {/* DERECHA: edición + TasksPanel */}
        <section>
          <h2>[DEBUG] COLUMNA DERECHA</h2>

          {/* Panel de edición del tablero seleccionado */}
          {selectedBoard && (
            <div
              style={{
                border: "1px solid #444",
                padding: "1rem",
                marginBottom: "1.5rem",
                borderRadius: "0.5rem"
              }}
            >
              <h3>Editar tablero seleccionado</h3>
              <form
                onSubmit={handleRenameBoard}
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginTop: "0.5rem"
                }}
              >
                <input
                  type="text"
                  value={editBoardTitle}
                  onChange={(e) => setEditBoardTitle(e.target.value)}
                  style={{ flex: 1, padding: "0.5rem" }}
                />
                <button type="submit">Renombrar</button>
              </form>

              <button
                onClick={handleDeleteBoard}
                style={{
                  marginTop: "0.75rem",
                  background: "#922",
                  color: "white",
                  border: "none",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer"
                }}
              >
                Eliminar tablero
              </button>
            </div>
          )}

          {/* TasksPanel para el tablero seleccionado */}
          <TasksPanel boardId={selectedBoardId} />
        </section>
      </div>
    </div>
  );
}
