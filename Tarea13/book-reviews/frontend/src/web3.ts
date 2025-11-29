// src/web3.ts
import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { createWeb3Modal } from '@web3modal/wagmi/react'

// ⚠️ Reemplazá con tu Project ID de WalletConnect (gratis)
export const WALLETCONNECT_PROJECT_ID = import.meta.env.VITE_WC_PROJECT_ID as string;
// RPC público provisto en el enunciado
export const RPC_URL = 'https://ethereum-sepolia-rpc.publicnode.com'

// 1) Config de wagmi (chains + transports)
export const chains = [sepolia] as const

const wagmiConfig = createConfig(
  defaultWagmiConfig({
    chains,
    projectId: WALLETCONNECT_PROJECT_ID,
    transports: {
      [sepolia.id]: http(RPC_URL),
    }
  })
)

// 2) Inicializar Web3Modal (UI de conexión)
createWeb3Modal({
  wagmiConfig,
  projectId: WALLETCONNECT_PROJECT_ID,
  enableAnalytics: false,
  themeMode: 'dark'
})

export { wagmiConfig }
