import { Router } from 'express'
import { SiweMessage } from 'siwe'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'changeme'
const DOMAIN = 'localhost'
const ORIGIN = 'http://localhost:3000'
const CHAIN_ID = 11155111 // Sepolia

// En memoria: address -> nonce
const nonces = new Map<string, string>()

export const authRouter = Router()

// POST /auth/message
// Recibe: { address }
// Devuelve: { message } para firmar con MetaMask
authRouter.post('/message', async (req, res) => {
  const { address } = req.body as { address?: string }

  if (!address) {
    return res.status(400).json({ error: 'Falta address' })
  }

  const nonce = crypto.randomUUID()
  nonces.set(address.toLowerCase(), nonce)

  const message = new SiweMessage({
    domain: DOMAIN,
    address,
    statement: 'Inicia sesión con Ethereum en la dApp de Faucet.',
    uri: ORIGIN,
    version: '1',
    chainId: CHAIN_ID,
    nonce
  }).prepareMessage()

  return res.json({ message })
})

// POST /auth/signin
// Recibe: { message, signature }
// Devuelve: { token, address }
authRouter.post('/signin', async (req, res) => {
  const { message, signature } = req.body as {
    message?: string
    signature?: string
  }

  if (!message || !signature) {
    return res.status(400).json({ error: 'Faltan datos' })
  }

  try {
    const siweMessage = new SiweMessage(message)
    const result = await siweMessage.verify({ signature })

    if (!result.success) {
      return res.status(401).json({ error: 'Firma inválida' })
    }

    const address = siweMessage.address.toLowerCase()
    const nonceExpected = nonces.get(address)

    if (!nonceExpected || nonceExpected !== siweMessage.nonce) {
      return res.status(401).json({ error: 'Nonce inválido o usado' })
    }

    // Una vez usado, se invalida el nonce
    nonces.delete(address)

    const token = jwt.sign({ address }, JWT_SECRET, { expiresIn: '1h' })

    return res.json({ token, address })
  } catch (err) {
    console.error(err)
    return res.status(400).json({ error: 'Error al verificar SIWE' })
  }
})
