export const FAUCET_ADDRESS = process.env.CONTRACT_ADDRESS as `0x${string}`
export const faucetAbi = [
  { type:'function', name:'claimTokens', stateMutability:'nonpayable', inputs:[], outputs:[] },
  { type:'function', name:'hasAddressClaimed', stateMutability:'view', inputs:[{name:'addr',type:'address'}], outputs:[{type:'bool'}] },
  { type:'function', name:'getFaucetUsers', stateMutability:'view', inputs:[], outputs:[{type:'address[]'}] },
  { type:'function', name:'getFaucetAmount', stateMutability:'view', inputs:[], outputs:[{type:'uint256'}] },
  { type:'function', name:'balanceOf', stateMutability:'view', inputs:[{name:'owner',type:'address'}], outputs:[{type:'uint256'}] },
] as const
