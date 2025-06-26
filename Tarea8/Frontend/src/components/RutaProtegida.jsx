// src/RutaProtegida.jsx
import { useAuthStore } from './store/authStore';
import { Navigate } from 'react-router-dom';

export default function RutaProtegida({ children }) {
  const { usuario, cargando } = useAuthStore();

  if (cargando) return <p>Cargando sesión...</p>;
  if (!usuario) return <Navigate to="/login" />;

  return children;
}
