import {
  LeafSchema,
  findLeafAssetIdPda,
  mintToCollectionV1,
  parseLeafFromMintToCollectionV1Transaction,
} from '@metaplex-foundation/mpl-bubblegum';
import type { KeypairSigner, Umi } from '@metaplex-foundation/umi';

export const mint = async (
  merkleTree: KeypairSigner,
  collectionMint: KeypairSigner,
  config: {
    name: string;
    uri: string;
  },
  umi: Umi
) => {
  const { signature } = await mintToCollectionV1(umi, {
    leafOwner: umi.payer.publicKey,
    merkleTree: merkleTree.publicKey,
    collectionMint: collectionMint.publicKey, 
    payer: umi.payer,
    metadata: {
      name: config.name,
      uri: config.uri,
      sellerFeeBasisPoints: 0,
      collection: { key: collectionMint.publicKey, verified: false },
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
      merkleTree: merkleTree.publicKey,
      leafIndex: leaf.nonce,
    })[0];
    return assetId;
  } catch (error) {
    console.log('❌ Failed to mint to collection', error);
  }
};
