import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { generateSiweMessage, SiweMessage } from 'siwe'
import { verifyMessage } from 'viem'
import { publicClient, walletClient, account } from './viem'
import { faucetAbi, FAUCET_ADDRESS } from './abi'

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

const JWT_SECRET = process.env.JWT_SECRET!
if (!JWT_SECRET) throw new Error('Falta JWT_SECRET')

/**
 * Helper: firma JWT con la address del usuario.
 */
function signUserJwt(address: `0x${string}`) {
  return jwt.sign({ sub: address }, JWT_SECRET, { expiresIn: '30m' })
}

/**
 * Middleware: exigir JWT válido.
 */
function requireAuth(req: any, res: any, next: any) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Falta token' })
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any
    req.user = { address: payload.sub as `0x${string}` }
    return next()
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

/**
 * POST /auth/message
 * Devuelve un mensaje SIWE para que el frontend lo firme con la wallet del usuario.
 */
app.post('/auth/message', async (req, res) => {
  const { address }:{ address?: `0x${string}` } = req.body
  if (!address) return res.status(400).json({ error: 'Falta address' })

  // Mensaje SIWE (puede incluir domain, uri, statement)
  const message = new SiweMessage({
    domain: req.headers.host,
    address,
    statement: 'Iniciar sesión con Ethereum para usar el Faucet',
    uri: 'https://example.org', // tu dominio real si tenés
    version: '1',
    chainId: 11155111, // Sepolia
    nonce: crypto.randomUUID().replace(/-/g, '').slice(0, 8),
    issuedAt: new Date().toISOString(),
  }).prepareMessage()

  // En este ejercicio, devolvemos el mensaje "crudo".
  // Si quisieras, podrías **persistir** el nonce para validarlo luego.
  res.json({ message })
})

/**
 * POST /auth/signin
 * Recibe { address, signature, message }, verifica firma y emite JWT.
 */
app.post('/auth/signin', async (req, res) => {
  const { address, signature, message }:{
    address?: `0x${string}`,
    signature?: `0x${string}`,
    message?: string
  } = req.body

  if (!address || !signature || !message) {
    return res.status(400).json({ error: 'Faltan campos' })
  }

  try {
    const ok = await verifyMessage({
      address,
      message,
      signature,
    })
    if (!ok) return res.status(401).json({ error: 'Firma inválida' })
    const token = signUserJwt(address)
    res.json({ token, address })
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: 'No se pudo verificar la firma' })
  }
})

/**
 * POST /faucet/claim (protegido)
 * Ejecuta claimTokens() desde el backend (wallet del servidor).
 */
app.post('/faucet/claim', requireAuth, async (req: any, res) => {
  const userAddress = req.user.address
  try {
    // (Opcional) chequeo previo: si ya reclamó
    const claimed = await publicClient.readContract({
      address: FAUCET_ADDRESS,
      abi: faucetAbi,
      functionName: 'hasAddressClaimed',
      args: [userAddress],
    })
    if (claimed) return res.json({ success: false, reason: 'Ya reclamaste' })

    const hash = await walletClient.writeContract({
      address: FAUCET_ADDRESS,
      abi: faucetAbi,
      functionName: 'claimTokens',
    })

    // Podés esperar confirmación si querés:
    // const receipt = await publicClient.waitForTransactionReceipt({ hash })

    res.json({ success: true, txHash: hash })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: 'Error al ejecutar claim' })
  }
})

/**
 * GET /faucet/status/:address (protegido)
 * Devuelve hasClaimed + balance + users[]
 */
app.get('/faucet/status/:address', requireAuth, async (req, res) => {
  const addr = req.params.address as `0x${string}`
  try {
    const [hasClaimed, balance, users] = await Promise.all([
      publicClient.readContract({ address: FAUCET_ADDRESS, abi: faucetAbi, functionName: 'hasAddressClaimed', args: [addr] }),
      publicClient.readContract({ address: FAUCET_ADDRESS, abi: faucetAbi, functionName: 'balanceOf', args: [addr] }),
      publicClient.readContract({ address: FAUCET_ADDRESS, abi: faucetAbi, functionName: 'getFaucetUsers' }),
    ])
    res.json({ hasClaimed, balance: balance.toString(), users })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error consultando estado' })
  }
})

const port = Number(process.env.PORT || 5055)
app.listen(port, () => {
  console.log(`API Faucet escuchando en http://localhost:${port}`)
  console.log(`Servidor firma tx con: ${account.address}`)
})
