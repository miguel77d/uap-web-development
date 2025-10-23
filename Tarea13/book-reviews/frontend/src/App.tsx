import { useEffect, useMemo, useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { formatEther, zeroAddress } from 'viem'
import { FAUCET_ADDRESS, faucetAbi } from './abi/faucetToken'
import { sepolia } from 'wagmi/chains'

// Botón de conexión de Web3Modal
function ConnectButton() {
  // Web3Modal monta su propio botón mediante custom element
  return <w3m-button balance="hide" size="md"></w3m-button>
}

export default function App() {
  const { address, chainId, isConnected } = useAccount()
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined)

  // --- LECTURAS (views) ---
  const { data: hasClaimed, refetch: refetchHasClaimed, isLoading: loadingClaimed } = useReadContract({
    address: FAUCET_ADDRESS,
    abi: faucetAbi,
    functionName: 'hasAddressClaimed',
    args: [address ?? zeroAddress],
    chainId: sepolia.id,
    query: { enabled: Boolean(address) }
  })

  const { data: faucetAmount } = useReadContract({
    address: FAUCET_ADDRESS,
    abi: faucetAbi,
    functionName: 'getFaucetAmount',
    chainId: sepolia.id
  })

  const { data: users, refetch: refetchUsers } = useReadContract({
    address: FAUCET_ADDRESS,
    abi: faucetAbi,
    functionName: 'getFaucetUsers',
    chainId: sepolia.id
  })

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: FAUCET_ADDRESS,
    abi: faucetAbi,
    functionName: 'balanceOf',
    args: [address ?? zeroAddress],
    chainId: sepolia.id,
    query: { enabled: Boolean(address) }
  })

  // --- ESCRITURA (tx) ---
  const { writeContract, isPending: isSending } = useWriteContract()
  const { isLoading: isMining, isSuccess, data: receipt } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  const canClaim = useMemo(() => {
    if (!isConnected) return false
    if (chainId !== sepolia.id) return false
    if (hasClaimed === undefined) return false
    return !hasClaimed
  }, [isConnected, chainId, hasClaimed])

  const handleClaim = async () => {
    try {
      setTxHash(undefined)
      const hash = await writeContract({
        address: FAUCET_ADDRESS,
        abi: faucetAbi,
        functionName: 'claimTokens',
        chainId: sepolia.id,
      })
      setTxHash(hash)
    } catch (err) {
      console.error('Error claim:', err)
      alert('Error al enviar la transacción. Revisá la consola.')
    }
  }

  useEffect(() => {
    if (isSuccess) {
      // Refrescamos lecturas al minar
      refetchHasClaimed()
      refetchUsers()
      refetchBalance()
    }
  }, [isSuccess, refetchHasClaimed, refetchUsers, refetchBalance])

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto', padding: 16 }}>
      <h1>FaucetToken – Sepolia</h1>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <ConnectButton />
        <div style={{ fontSize: 14, opacity: 0.8 }}>
          Red: {chainId === sepolia.id ? 'Sepolia ✅' : 'Por favor, cambiá a Sepolia'}
        </div>
      </div>

      <section style={{ border: '1px solid #444', borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <h3>Información del contrato</h3>
        <p><strong>Dirección:</strong> {FAUCET_ADDRESS}</p>
        <p><strong>Monto por claim:</strong> {faucetAmount ? formatEther(BigInt(faucetAmount as any)) : '—'} tokens</p>
      </section>

      <section style={{ border: '1px solid #444', borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <h3>Tu estado</h3>
        <p><strong>Tu wallet:</strong> {address ?? '—'}</p>
        <p><strong>Balance:</strong> {balance ? formatEther(BigInt(balance as any)) : '—'} tokens</p>
        <p><strong>¿Ya reclamaste?</strong> {loadingClaimed ? 'Cargando…' : hasClaimed ? 'Sí ✅' : 'No ❌'}</p>

        <button
          disabled={!canClaim || isSending || isMining}
          onClick={handleClaim}
          style={{ padding: '8px 14px', marginTop: 8 }}
        >
          {isSending ? 'Firmá en tu wallet…'
            : isMining ? 'Confirmando en blockchain…'
            : canClaim ? 'Reclamar tokens' : 'No disponible'}
        </button>

        {txHash && (
          <p style={{ marginTop: 8 }}>
            Tx enviada: <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank">ver en Etherscan</a>
          </p>
        )}
        {isSuccess && receipt && <p>¡Hecho! Bloque #{Number(receipt.blockNumber)}</p>}
      </section>

      <section style={{ border: '1px solid #444', borderRadius: 8, padding: 16 }}>
        <h3>Usuarios que interactuaron</h3>
        {Array.isArray(users) && users.length > 0 ? (
          <ul>
            {users.map((u: string) => <li key={u}>{u}</li>)}
          </ul>
        ) : <p>Sin datos aún.</p>}
      </section>
    </div>
  )
}
