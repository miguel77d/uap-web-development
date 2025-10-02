// src/abi/faucetToken.ts
export const FAUCET_ADDRESS = '0x3e2117c19a921507ead57494bbf29032f33c7412' as const

export const faucetAbi = [
  // claimTokens() -> tx
  {
    type: 'function',
    name: 'claimTokens',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: []
  },
  // hasAddressClaimed(address) -> bool (view)
  {
    type: 'function',
    name: 'hasAddressClaimed',
    stateMutability: 'view',
    inputs: [{ name: 'addr', type: 'address' }],
    outputs: [{ type: 'bool' }]
  },
  // getFaucetUsers() -> address[] (view)
  {
    type: 'function',
    name: 'getFaucetUsers',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'address[]' }]
  },
  // getFaucetAmount() -> uint256 (view)
  {
    type: 'function',
    name: 'getFaucetAmount',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }]
  },
  // balanceOf(address) -> uint256 (view) [ERC20]
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ type: 'uint256' }]
  },
] as const
