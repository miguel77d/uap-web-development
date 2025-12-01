// Añadí arriba:
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5055'

async function signinWithEthereum(address: string, signMessageAsync: (args: { message: string }) => Promise<`0x${string}`>) {
  // 1) pedir mensaje
  const r1 = await fetch(`${API_URL}/auth/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address })
  })
  const { message } = await r1.json()

  // 2) firmar con la wallet
  const signature = await signMessageAsync({ message })

  // 3) enviar firma
  const r2 = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, signature, message })
  })
  const data = await r2.json()
  if (!data.token) throw new Error('No se recibió token')
  localStorage.setItem('jwt', data.token)
  return data.token as string
}

async function apiGetStatus(jwt: string, address: string) {
  const r = await fetch(`${API_URL}/faucet/status/${address}`, {
    headers: { Authorization: `Bearer ${jwt}` }
  })
  if (!r.ok) throw new Error('Error status')
  return r.json()
}

async function apiClaim(jwt: string) {
  const r = await fetch(`${API_URL}/faucet/claim`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwt}` }
  })
  if (!r.ok) throw new Error('Error claim')
  return r.json()
}
