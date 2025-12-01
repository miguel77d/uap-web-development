import { createPublicClient, createWalletClient, http, type Hex } from 'viem'
import { sepolia } from 'viem/chains'

const RPC_URL = process.env.RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com'
const PRIVATE_KEY = process.env.PRIVATE_KEY as Hex

// Cliente solo-lectura
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(RPC_URL)
})

// Cliente con wallet (firma y manda transacciones)
export const walletClient = createWalletClient({
  chain: sepolia,
  transport: http(RPC_URL),
  account: PRIVATE_KEY
})
