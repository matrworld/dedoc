import { mintV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
import {
  generateSigner,
  percentAmount,
  publicKey,
  type Umi,
} from '@metaplex-foundation/umi';
import { createV1 } from '@metaplex-foundation/mpl-token-metadata';
import 'dotenv/config';
import { generateCollectionUri } from '../utils/create-collection-uri';

export const createCollection = async (
  umi: Umi,
  config: {
    name: string;
    description: string;
    image: string;
  }
) => {
  console.log('Creating collection...');
  const uri = await generateCollectionUri({
    creator: umi.payer.publicKey,
    imageUri: config.image,
  });
  const jsonUri = await umi.uploader.uploadJson(uri)
  console.log('Collection json uri:', jsonUri)
  const collectionMint = generateSigner(umi);
   const mint = await createV1(umi, {
    mint: collectionMint,
    authority: umi.payer,
    name: config.name,
    uri: 'jsonUri',
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
  console.log('Collection created:', collectionMint.publicKey.toString())
  let attempts = 0;
  while (attempts < 10) {
    try {
      await mintV1(umi, {
        mint: collectionMint.publicKey,
        amount: 1,
        authority: umi.payer,
        tokenOwner: umi.payer.publicKey,
        tokenStandard: TokenStandard.NonFungible,
      }).sendAndConfirm(umi);
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
