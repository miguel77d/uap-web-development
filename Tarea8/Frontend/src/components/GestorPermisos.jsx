// src/components/GestorPermisos.jsx
import { usePermisos } from '../hooks/usePermisos';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

export default function GestorPermisos() {
  const { tableroId } = useParams();
  const { data: permisos = [], refetch } = usePermisos(tableroId);
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('viewer');

  const compartir = async () => {
    const res = await fetch('http://localhost:3000/api/permisos', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, tableroId: parseInt(tableroId), rol }),
    });
    if (res.ok) {
      setEmail('');
      refetch();
    } else {
       const error = await res.json();
  alert(error.error || 'Error al compartir');
    }
  };

  const cambiarRol = async (id, nuevoRol) => {
    await fetch('http://localhost:3000/api/permisos', {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rol: nuevoRol }),
    });
    refetch();
  };

  const eliminarPermiso = async (id) => {
    await fetch('http://localhost:3000/api/permisos', {
      method: 'DELETE',
      credentials: 'include',
    });
    refetch();
  };

  return (
    <div className="bg-gray-800 p-4 mt-4 rounded-md">
      <h2 className="text-white text-lg font-bold mb-2">Usuarios con acceso</h2>

      <ul className="mb-4">
        {permisos.map((p) => (
          <li key={p.id} className="flex justify-between items-center mb-1">
            <span>{p.usuario.nombre} ({p.usuario.email}) — <strong>{p.rol}</strong></span>
            <div className="flex gap-2">
              <select
                value={p.rol}
                onChange={(e) => cambiarRol(p.id, e.target.value)}
                className="bg-gray-700 text-white rounded px-1 py-0.5"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="owner" disabled>Owner</option>
              </select>
              <button
                onClick={() => eliminarPermiso(p.id)}
                className="text-red-400 hover:text-red-600"
              >
                Quitar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h3 className="text-white font-semibold mb-1">Agregar nuevo usuario:</h3>
      <div className="flex gap-2">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo del usuario"
          className="bg-gray-700 text-white px-2 py-1 rounded"
        />
        <select
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          className="bg-gray-700 text-white rounded px-1"
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
        </select>
        <button onClick={compartir} className="bg-blue-600 px-3 py-1 rounded">
          Compartir
        </button>
      </div>
    </div>
  );
}
