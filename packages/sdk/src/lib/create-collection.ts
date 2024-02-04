import { mintV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
import {
  generateSigner,
  percentAmount,
  publicKey,
} from '@metaplex-foundation/umi';
import { createV1 } from '@metaplex-foundation/mpl-token-metadata';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { keypairIdentity } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

import { base64ToUint8Array } from './keypair';
import { generateProjectUri } from '../utils/create-collection-uri';

export const createCollection = async (
  rpc: string,
  privateKey: string,
  config: {
    name: string;
    description: string;
    image: string;
  }
) => {
  const umi = createUmi(rpc);
  const keypair = umi.eddsa.createKeypairFromSecretKey(
    base64ToUint8Array(privateKey)
  );
  umi
    .use(keypairIdentity(keypair))
    .use(
      irysUploader({
        priceMultiplier: 1.5,
      })
    )
    .use(mplTokenMetadata());
  const uri = await generateProjectUri({
    name: config.name,
    description: config.description,
    creator: keypair.publicKey.toString(),
    imageUri: config.image,
  });
  console.log('Uploading JSON URI...');
  const jsonUri = await umi.uploader.uploadJson(uri);
  console.log('Uploaded JSON URI: ', jsonUri);
  const collectionMint = generateSigner(umi);
  console.log('Creating new collection...');

  const result = await createV1(umi, {
    mint: collectionMint,
    name: config.name,
    uri: jsonUri,
    creators: [
      {
        address: keypair.publicKey,
        verified: true,
        share: 100,
      },
      {
        address: publicKey('HuXKdwmhosykXwvGjQSSL73hBFC9m7XNijgYD5AVV65G'), // DeDoc address
        verified: false,
        share: 0,
      },
    ],
    sellerFeeBasisPoints: percentAmount(0),
    isCollection: true,
    tokenStandard: TokenStandard.NonFungible,
  }).sendAndConfirm(umi);
  console.log('Minting new collection...');

  let attempts = 0;
  while (attempts < 10) {
    try {
      const mintResult = await mintV1(umi, {
        mint: collectionMint.publicKey,
        amount: 1,
        tokenOwner: umi.payer.publicKey,
        tokenStandard: TokenStandard.NonFungible,
      }).sendAndConfirm(umi);
      console.log('✅ Collection created!\nMint: ', collectionMint.publicKey);
      return collectionMint.publicKey.toString();
    } catch (error) {
      console.error('Minting failed on attempt', attempts + 1);
      attempts++;
      if (attempts >= 10) {
        throw new Error('Maximum minting attempts reached. Minting failed.');
      }
    }
  }
};
