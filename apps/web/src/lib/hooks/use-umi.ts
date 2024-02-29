import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';

export const useUmi = (wallet: any) => {
  const umi = createUmi('https://mainnet.admin6074.workers.dev/', { commitment: 'finalized' });
  umi
    .use(irysUploader({ priceMultiplier: 1.5 }))
    .use(mplTokenMetadata())
    .use(dasApi())
    .use(walletAdapterIdentity(wallet));
  return umi;
}
