import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';

export const useUmi = (wallet: any) => {
  const umi = createUmi('https://mainnet.helius-rpc.com/?api-key=2cb827e8-a527-4f73-a7b8-15e78ff27e40', { commitment: 'finalized' });
  umi
    .use(irysUploader({ priceMultiplier: 1.5 }))
    .use(mplTokenMetadata())
    .use(dasApi())
    .use(walletAdapterIdentity(wallet));
  return umi;
}
