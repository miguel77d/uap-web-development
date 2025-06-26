// src/pages/RedirectAlPrimerTablero.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RedirectAlPrimerTablero() {
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/tableros', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        const tableros = data.tableros ?? [];
        if (tableros.length > 0) {
          navigate(`/tablero/${tableros[0].id}`, { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      })
      .finally(() => setCargando(false));
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center text-white bg-gray-900">
      {cargando ? <p>Redirigiendo...</p> : <p>No hay tableros disponibles.</p>}
    </main>
  );
}
