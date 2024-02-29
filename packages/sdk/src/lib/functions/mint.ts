import {
  LeafSchema,
  findLeafAssetIdPda,
  mintToCollectionV1,
  parseLeafFromMintToCollectionV1Transaction,
} from '@metaplex-foundation/mpl-bubblegum';
import type { PublicKey, Umi } from '@metaplex-foundation/umi';
import { createProjectConfigUri } from '../utils/create-project-uri';
import { imageUri } from '../types/const';

export const mint = async (
  merkleTree: PublicKey,
  collectionMint: PublicKey,
  config: {
    name: string;
  },
  umi: Umi
) => {
  const project = await createProjectConfigUri({
      name: config.name, 
      image: imageUri
  })
  const uri = await umi.uploader.uploadJson(project)
  const { signature } = await mintToCollectionV1(umi, {
    leafOwner: umi.payer.publicKey,
    merkleTree: merkleTree,
    collectionMint: collectionMint, 
    payer: umi.payer,
    metadata: {
      name: config.name,
      uri: uri,
      sellerFeeBasisPoints: 0,
      collection: { key: collectionMint, verified: true },
      creators: [
        { address: umi.identity.publicKey, verified: false, share: 100 },
      ],
    },
  }).sendAndConfirm(umi, { confirm: { commitment: 'finalized' } });
  try {
    const leaf: LeafSchema = await parseLeafFromMintToCollectionV1Transaction(
      umi,
      signature
    );
    const assetId = findLeafAssetIdPda(umi, {
      merkleTree: merkleTree,
      leafIndex: leaf.nonce,
    })[0];
    return assetId;
  } catch (error) {
    console.log('❌ Failed to mint to collection', error);
  }
};
