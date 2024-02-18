import {
  LeafSchema,
  findLeafAssetIdPda,
  mintToCollectionV1,
  parseLeafFromMintToCollectionV1Transaction,
} from '@metaplex-foundation/mpl-bubblegum';

export const mintToCollection = async (
  merkleTree: any,
  collectionMint: any,
  projectConfig: any,
  umi: any
) => {
  const { signature } = await mintToCollectionV1(umi, {
    leafOwner: umi.payer.publicKey,
    merkleTree: merkleTree.publicKey,
    collectionMint: collectionMint.publicKey,
    collectionAuthorityRecordPda: collectionMint.collectionAuthority,
    payer: umi.payer,
    metadata: {
      name: '_dedoc',
      symbol: 'DEDOC',
      uri: projectConfig,
      sellerFeeBasisPoints: 0,
      collection: { key: collectionMint.publicKey, verified: false },
      creators: [
        { address: umi.identity.publicKey, verified: false, share: 100 },
      ],
    },
  }).sendAndConfirm(umi, { confirm: { commitment: 'finalized' } });
  console.log('✅ Minted to collection!');
  try {
    const leaf: LeafSchema = await parseLeafFromMintToCollectionV1Transaction(
      umi,
      signature
    );
    const assetId = findLeafAssetIdPda(umi, {
      merkleTree: merkleTree.publicKey,
      leafIndex: leaf.nonce,
    });
    console.log('✅ Found asset ID', assetId);
    return {
      assetId,
    };
  } catch (error) {
    console.log('❌ Failed to mint to collection', error);
  }
};
