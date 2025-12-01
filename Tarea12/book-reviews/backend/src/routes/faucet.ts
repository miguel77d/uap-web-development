import { Router } from 'express'
import { formatEther } from 'viem'
import { authMiddleware, type AuthRequest } from '../middleware/authJwt'
import { publicClient, walletClient } from '../web3Client'
import { FAUCET_ADDRESS, faucetTokenAbi } from '../contracts/faucetToken'

export const faucetRouter = Router()

// POST /faucet/claim (PROTEGIDO)
faucetRouter.post(
  '/claim',
  authMiddleware,
  async (req: AuthRequest, res) => {
    try {
      const address = req.userAddress
      if (!address) {
        return res.status(400).json({ error: 'No se pudo obtener la address' })
      }

      // Ejecutamos claimTokens() desde el backend
      const hash = await walletClient.writeContract({
        abi: faucetTokenAbi,
        address: FAUCET_ADDRESS,
        functionName: 'claimTokens'
      })

      return res.json({ txHash: hash, success: true })
    } catch (err: any) {
      console.error(err)
      return res.status(500).json({
        success: false,
        error: err?.message ?? 'Error al ejecutar claimTokens'
      })
    }
  }
)

// GET /faucet/status/:address (PROTEGIDO)
faucetRouter.get(
  '/status/:address',
  authMiddleware,
  async (req: AuthRequest, res) => {
    try {
      const target = req.params.address as `0x${string}`

      const [hasClaimed, balance, users, faucetAmount] = await Promise.all([
        publicClient.readContract({
          abi: faucetTokenAbi,
          address: FAUCET_ADDRESS,
          functionName: 'hasAddressClaimed',
          args: [target]
        }),
        publicClient.readContract({
          abi: faucetTokenAbi,
          address: FAUCET_ADDRESS,
          functionName: 'balanceOf',
          args: [target]
        }),
        publicClient.readContract({
          abi: faucetTokenAbi,
          address: FAUCET_ADDRESS,
          functionName: 'getFaucetUsers'
        }),
        publicClient.readContract({
          abi: faucetTokenAbi,
          address: FAUCET_ADDRESS,
          functionName: 'getFaucetAmount'
        })
      ])

      return res.json({
        hasClaimed,
        balance: formatEther(balance as bigint),
        faucetAmount: formatEther(faucetAmount as bigint),
        users
      })
    } catch (err: any) {
      console.error(err)
      return res.status(500).json({
        error: err?.message ?? 'Error al obtener el estado del faucet'
      })
    }
  }
)
