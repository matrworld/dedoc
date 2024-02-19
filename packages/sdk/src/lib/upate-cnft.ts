import {
  getAssetWithProof,
  updateMetadata,
  UpdateArgsArgs,
} from '@metaplex-foundation/mpl-bubblegum';
import { type Umi, some, PublicKey, type KeypairSigner } from '@metaplex-foundation/umi';
import { encode } from 'bs58';

export const updateCnft = async (
  umi: Umi,
  collectionMint: KeypairSigner,
  assetId: PublicKey,
  config: {
    name?: string;
    uri?: string;
  }
) => {
  const assetWithProof = await getAssetWithProof(umi, assetId);
  const updateArgs: UpdateArgsArgs = {
    name: some(config.name || assetWithProof.metadata.name),
    uri: some(config.uri || assetWithProof.metadata.uri),
  };
  const update = await updateMetadata(umi, {
    ...assetWithProof,
    leafOwner: assetWithProof.leafOwner,
    currentMetadata: assetWithProof.metadata,
    updateArgs,
    authority: umi.payer,
    collectionMint: collectionMint.publicKey,
  }).sendAndConfirm(umi, { confirm: { commitment: 'finalized' } });

  return encode(update.signature);
};
