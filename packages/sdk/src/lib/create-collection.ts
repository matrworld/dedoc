import { mintV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
import {
  generateSigner,
  percentAmount,
  publicKey,
  type Umi,
} from '@metaplex-foundation/umi';
import { createV1 } from '@metaplex-foundation/mpl-token-metadata';
import 'dotenv/config';
import { generateProjectUri } from '../utils/create-collection-uri';

export const createCollection = async (
  umi: Umi,
  config: {
    name: string;
    description: string;
    image: string;
  }
) => {
  const uri = await generateProjectUri({
    name: config.name,
    description: config.description,
    creator: umi.payer.publicKey,
    imageUri: config.image,
  });
  const jsonUri = await umi.uploader.uploadJson(uri);
  const collectionMint = generateSigner(umi);
   await createV1(umi, {
    mint: collectionMint,
    authority: umi.payer,
    name: config.name,
    uri: jsonUri,
    creators: [
      {
        address: umi.payer.publicKey,
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
  let attempts = 0;
  while (attempts < 10) {
    try {
      await mintV1(umi, {
        mint: collectionMint.publicKey,
        amount: 1,
        authority: umi.payer,
        tokenOwner: umi.payer.publicKey,
        tokenStandard: TokenStandard.NonFungible,
      }).sendAndConfirm(umi, { confirm: { commitment: 'finalized' } });
      return collectionMint;
    } catch (error) {
      console.error('Minting failed on attempt', attempts + 1);
      attempts++;
      if (attempts >= 10) {
        throw new Error('Maximum minting attempts reached. Minting failed.');
      }
    }
  }
};
