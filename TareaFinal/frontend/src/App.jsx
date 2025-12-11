// src/App.jsx
import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate
} from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";

// 👇 Estas funciones tienen que existir en src/api/auth.js
import {
  loginUser,
  registerUser,
  fetchCurrentUser,
  logoutUser
} from "./api/auth";

// 👇 AHORA importamos la página de tableros desde ./pages
import BoardsPage from "./pages/BoardsPage";

/* ------------------------------------------------------------------ */
/*  PÁGINA: LOGIN                                                      */
/* ------------------------------------------------------------------ */

function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    mutate: doLogin,
    isLoading,
    error
  } = useMutation({
    mutationFn: (data) => loginUser(data),
    onSuccess: () => {
      // invalidamos el usuario cacheado y redirigimos a /boards
      queryClient.invalidateQueries(["currentUser"]);
      navigate("/boards");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    doLogin({ email, password });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: 320 }}>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
              required
            />
          </label>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
              required
            />
          </label>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: "1rem" }}>{error.message}</p>
      )}

      <p style={{ marginTop: "1rem" }}>
        ¿No tenés cuenta? <Link to="/register">Registrate acá</Link>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PÁGINA: REGISTRO                                                  */
/* ------------------------------------------------------------------ */

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: doRegister, isLoading, error } = useMutation({
    mutationFn: (data) => registerUser(data),
    onSuccess: () => {
      // después de registrarse, lo mandamos al login
      navigate("/login");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    doRegister({ email, name, password });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Registro</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: 320 }}>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
              required
            />
          </label>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>
            Nombre (opcional)
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>
            Contraseña (mínimo 6 caracteres)
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
              required
            />
          </label>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creando cuenta..." : "Registrarse"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: "1rem" }}>{error.message}</p>
      )}

      <p style={{ marginTop: "1rem" }}>
        ¿Ya tenés cuenta? <Link to="/login">Ir al login</Link>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  APP: DEFINICIÓN DE RUTAS                                         */
/* ------------------------------------------------------------------ */

function App() {
  return (
    <Routes>
      {/* raíz → redirige a /boards (si está logueado) */}
      <Route path="/" element={<Navigate to="/boards" replace />} />

      {/* auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* boards + tareas */}
      <Route path="/boards" element={<BoardsPage />} />

      {/* 404 genérica */}
      <Route path="*" element={<div>404 – Página no encontrada</div>} />
    </Routes>
  );
}

export default App;
