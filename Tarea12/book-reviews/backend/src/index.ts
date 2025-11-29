import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { authRouter } from './routes/auth'
import { faucetRouter } from './routes/faucet'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())

// Rutas de auth y faucet
app.use('/auth', authRouter)
app.use('/faucet', faucetRouter)

// (Si tenías otras rutas de la API de libros, podés montarlas acá también)
// app.use('/api/books', booksRouter)

app.get('/', (_req, res) => {
  res.send('Backend Web3 funcionando')
})

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})
