import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../store/uiStore'; // Asegurate de tener esto

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuthStore();
  const showToast = useUIStore((state) => state.showToast); // accedemos al toast
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      showToast({ type: 'success', msg: 'Sesión iniciada con éxito' });

      // Delay para ver el toast antes de redirigir
      setTimeout(() => navigate('/'), 500);
    } catch {
      showToast({ type: 'error', msg: 'Credenciales incorrectas' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 bg-gray-800 p-6 rounded-md shadow-md">
      <h2 className="text-xl font-semibold text-white mb-4 text-center">Iniciar Sesión</h2>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        className="w-full mb-4 px-3 py-2 rounded bg-gray-700 text-white"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        Iniciar sesión
      </button>

      <p className="text-sm mt-4 text-center text-gray-300">
        ¿No tenés cuenta?{' '}
        <a href="/register" className="text-blue-400 underline">
          Registrate
        </a>
      </p>
    </form>
  );
}
