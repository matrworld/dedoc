import { mintV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createV1 } from '@metaplex-foundation/mpl-token-metadata'
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { keypairIdentity } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'

import { base64ToUint8Array } from './keypair';

export const createCollection = async (
  rpc: string,
  privateKey: string,
  config: {
    name: string,
    uri: string,
    sellerFeeBasisPoints: number, // 5.5 = 5.5%
  }
) => {
  console.log(rpc, privateKey, config)
  const umi = createUmi(rpc);

  const keypair = umi.eddsa.createKeypairFromSecretKey(base64ToUint8Array(privateKey));

  umi
  .use(keypairIdentity(keypair))
  .use(irysUploader({
      priceMultiplier: 1.5
  }))
  .use(mplTokenMetadata());

  const collectionMint = generateSigner(umi);
  
  console.log("Creating new collection...");

  const result = await createV1(umi, {
      mint: collectionMint,
      name: config.name,
      uri: config.uri,
      sellerFeeBasisPoints: percentAmount(config.sellerFeeBasisPoints),
      isCollection: true,
      tokenStandard: TokenStandard.NonFungible,
  }).sendAndConfirm(umi);

  console.log("Minting new collection...");

  const mintResult = await mintV1(umi, {
      mint: collectionMint.publicKey,
      amount: 1,
      tokenOwner: umi.payer.publicKey,
      tokenStandard: TokenStandard.NonFungible,
  }).sendAndConfirm(umi);

  console.log("✅ Collection created!\nMint: ", collectionMint.publicKey);
}