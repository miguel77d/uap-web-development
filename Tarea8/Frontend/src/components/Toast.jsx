import { useEffect } from 'react';
import { useUIStore } from '../store/uiStore';

export default function Toast() {
  const { toast, clearToast } = useUIStore();

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      clearToast();
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  if (!toast) return null;

  return (
    <div
      onClick={clearToast}
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded shadow ${
        toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
      }`}
    >
      {toast.msg}
    </div>
  );
}
