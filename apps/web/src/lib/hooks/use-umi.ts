import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { useWallet } from '@solana/wallet-adapter-react'
import { web3JsRpc } from '@metaplex-foundation/umi-rpc-web3js';

export const useUmi = () => {
  // Import useWallet hook
  const wallet = useWallet();

  // Create Umi instance
  const umi = createUmi('https://mainnet.admin6074.workers.dev/')
      .use(mplTokenMetadata())
      .use(web3JsRpc('https://mainnet.admin6074.workers.dev/'))
      // Register Wallet Adapter to Umi
      .use(walletAdapterIdentity(wallet))

  return umi;
}
