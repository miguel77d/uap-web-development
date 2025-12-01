'use client';

import { useEffect, useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import ConnectWallet from '../../components/ConnectWallet';

const BACKEND_URL = 'http://localhost:4000';

type FaucetStatus = {
  hasClaimed: boolean;
  balance: string;       // en tokens humanos
  faucetAmount: string;  // en tokens humanos
  users: string[];
};

export default function FaucetPage() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync, isPending: isSigning } = useSignMessage();

  const [jwt, setJwt] = useState<string | null>(null);
  const [status, setStatus] = useState<FaucetStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authOk, setAuthOk] = useState(false);

  // 1) Al montar, intento recuperar el JWT del localStorage
  useEffect(() => {
    const stored = typeof window !== 'undefined'
      ? localStorage.getItem('faucet_jwt')
      : null;
    if (stored) {
      setJwt(stored);
      setAuthOk(true);
    }
  }, []);

  // 2) Cuando tengo JWT + address conectada, traigo el estado del faucet
  useEffect(() => {
    if (jwt && address) {
      fetchStatus(address);
    }
  }, [jwt, address]);

  async function handleLoginWithEthereum() {
    try {
      setError(null);

      if (!isConnected || !address) {
        setError('Primero conectá tu wallet con el botón de arriba.');
        return;
      }

      setAuthLoading(true);

      // 1) Pedimos el mensaje SIWE al backend
      const msgRes = await fetch(`${BACKEND_URL}/auth/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });

      if (!msgRes.ok) {
        const data = await msgRes.json().catch(() => ({}));
        throw new Error(data.error || 'Error al pedir el mensaje SIWE');
      }

      const { message } = await msgRes.json() as { message: string };

      // 2) Firmamos el mensaje con la wallet (MetaMask)
      const signature = await signMessageAsync({ message });

      // 3) Enviamos mensaje + firma al backend para obtener el JWT
      const signinRes = await fetch(`${BACKEND_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature })
      });

      if (!signinRes.ok) {
        const data = await signinRes.json().catch(() => ({}));
        throw new Error(data.error || 'Error al hacer signin');
      }

      const { token } = await signinRes.json() as { token: string; address: string };

      setJwt(token);
      setAuthOk(true);

      if (typeof window !== 'undefined') {
        localStorage.setItem('faucet_jwt', token);
      }

      // Traigo el estado del faucet ahora que tengo auth
      if (address) {
        await fetchStatus(address);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error en Sign-In with Ethereum');
      setAuthOk(false);
    } finally {
      setAuthLoading(false);
    }
  }

  async function fetchStatus(targetAddress: string) {
    try {
      if (!jwt) return;

      setLoadingStatus(true);
      setError(null);

      const res = await fetch(`${BACKEND_URL}/faucet/status/${targetAddress}`, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Error al obtener estado del faucet');
      }

      const data = await res.json() as FaucetStatus;
      setStatus(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error al leer estado del faucet');
    } finally {
      setLoadingStatus(false);
    }
  }

  async function handleClaim() {
    try {
      if (!jwt) {
        setError('Tenés que iniciar sesión con Ethereum primero.');
        return;
      }

      setClaimLoading(true);
      setError(null);

      const res = await fetch(`${BACKEND_URL}/faucet/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        }
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al hacer claimTokens desde el backend');
      }

      // Opcional: mostrar txHash, podrías linkear a Etherscan
      console.log('txHash:', data.txHash);

      // Actualizar estado (balance, hasClaimed, users)
      if (address) {
        await fetchStatus(address);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error al reclamar tokens');
    } finally {
      setClaimLoading(false);
    }
  }

  const canUseFaucet = isConnected && authOk && !!jwt;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <h1 className="text-3xl font-bold mb-4">Faucet Token dApp (con Backend)</h1>

      {/* Conexión de wallet */}
      <div className="mb-4">
        <ConnectWallet />
      </div>

      {!isConnected && (
        <p className="text-sm text-gray-300 mb-4">
          Conectá tu wallet en la red Sepolia para continuar.
        </p>
      )}

      {/* Botón de Sign-In with Ethereum */}
      {isConnected && (
        <div className="mb-4 space-y-2">
          <button
            onClick={handleLoginWithEthereum}
            disabled={authLoading || isSigning}
            className="rounded bg-indigo-600 px-4 py-2 font-semibold disabled:bg-gray-600"
          >
            {authLoading || isSigning
              ? 'Firmando mensaje...'
              : authOk
              ? 'Sesión iniciada ✔'
              : 'Iniciar sesión con Ethereum'}
          </button>
          {authOk && (
            <p className="text-xs text-emerald-400">
              Autenticado con JWT. Podés usar el faucet.
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400 mb-4">
          {error}
        </p>
      )}

      {/* Info del faucet + botón claim */}
      {canUseFaucet && address && (
        <section className="space-y-3 mt-4">
          <p className="text-sm text-gray-300">
            Dirección conectada:{' '}
            <span className="font-mono">{address}</span>
          </p>

          {loadingStatus && <p>Cargando estado del faucet...</p>}

          {status && !loadingStatus && (
            <>
              <p>
                Monto del faucet:{' '}
                <strong>{status.faucetAmount} FAUCET</strong>
              </p>
              <p>
                Tu balance:{' '}
                <strong>{status.balance} FAUCET</strong>
              </p>
              <p>
                Estado de reclamo:{' '}
                {status.hasClaimed
                  ? 'Ya reclamaste 😎'
                  : 'Todavía no reclamaste 🚰'}
              </p>

              <button
                onClick={handleClaim}
                disabled={claimLoading || status.hasClaimed}
                className="mt-2 rounded bg-emerald-600 px-4 py-2 font-semibold disabled:bg-gray-600"
              >
                {claimLoading
                  ? 'Ejecutando claim desde el backend...'
                  : status.hasClaimed
                  ? 'Ya reclamaste'
                  : 'Reclamar tokens'}
              </button>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">
                  Usuarios que usaron el faucet
                </h2>
                {status.users && status.users.length > 0 ? (
                  <ul className="space-y-1 text-sm font-mono">
                    {status.users.map((u) => (
                      <li key={u}>{u}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">
                    Todavía no hay usuarios registrados.
                  </p>
                )}
              </div>
            </>
          )}
        </section>
      )}
    </main>
  );
}
