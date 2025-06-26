// src/RutaProtegida.jsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";

export default function RutaProtegida({ children }) {
  const usuario = useAuthStore((s) => s.usuario);

  if (!usuario) {
    // Si no hay usuario logueado, redirige al login
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario, muestra el contenido protegido
  return children;
}
