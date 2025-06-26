// src/pages/Registro.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.withCredentials = true;
const API = 'http://localhost:3000/api';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${API}/register`, {
        nombre,
        email,
        password,
      });

      // Después del registro, redirigimos al login
      navigate('/login');
    } catch (err) {
      setError('No se pudo registrar. Verificá los datos.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 space-y-4">
      <h2 className="text-2xl font-bold text-center">Crear cuenta</h2>

      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre completo"
        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo electrónico"
        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
      />
      {error && <p className="text-red-400">{error}</p>}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
      >
        Registrarse
      </button>
      <p className="text-sm mt-4 text-center">
  ¿Ya tenés cuenta? <a href="/login" className="text-blue-400 underline">Iniciar sesión</a>
</p>
    </form>
  );
}
