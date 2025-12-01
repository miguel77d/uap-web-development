import { createPublicClient, createWalletClient, http, parseAccount } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

const RPC_URL = process.env.RPC_URL!

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(RPC_URL),
})

const pk = (process.env.PRIVATE_KEY || '').trim()
if (!pk) throw new Error('Falta PRIVATE_KEY en .env')

export const account = privateKeyToAccount(`0x${pk}`)
export const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(RPC_URL),
})
