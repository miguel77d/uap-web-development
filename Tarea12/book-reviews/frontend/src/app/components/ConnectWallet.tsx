'use client';
import { useAccount, useDisconnect } from 'wagmi';
import { Web3Button } from '@web3modal/wagmi/react'

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div>
      {!isConnected ? (
        <Web3Button />
      ) : (
        <div>
          <p>Conectado: {address}</p>
          <button onClick={() => disconnect()}>Desconectar</button>
        </div>
      )}
    </div>
  );
}
