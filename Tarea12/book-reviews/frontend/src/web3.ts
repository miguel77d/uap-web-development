// src/web3.ts
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { sepolia } from 'wagmi/chains'
import { createWeb3Modal } from '@web3modal/wagmi/react'

// 1) Definimos el ID del proyecto (Web3Modal Project ID)
// 👇 CONSEJO: usá un projectId REAL creado en https://cloud.walletconnect.com/
// por ahora dejamos uno de prueba (pero deberías reemplazarlo)
export const projectId = 'demo-project-id-1234';

// 2) Configuración principal de wagmi + viem
export const wagmiConfig = defaultWagmiConfig({
  chains: [sepolia],
  projectId,
  metadata: {
    name: 'Faucet Token DApp',
    description: 'App React para reclamar tokens del FaucetToken',
    url: 'http://localhost:3000',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  }
})

// 3) Inicializamos Web3Modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains: [sepolia]
})
