import {
  getAssetWithProof,
  updateMetadata,
  UpdateArgsArgs,
} from '@metaplex-foundation/mpl-bubblegum';
import { type Umi, some, PublicKey, type KeypairSigner, publicKey } from '@metaplex-foundation/umi';
import { encode } from 'bs58';
import { Project } from '../types/project';

export const updateProject = async (
  umi: Umi,
  collection: string,
  project: Project
) => {
  const jsonUri = await umi.uploader.uploadJson(project);

  const assetWithProof = await getAssetWithProof(umi, publicKey(project.id));

  const updateArgs: UpdateArgsArgs = {
    name: some(project.name || assetWithProof.metadata.name),
    uri: some(jsonUri || assetWithProof.metadata.uri),
  };

  const update = await updateMetadata(umi, {
    ...assetWithProof,
    leafOwner: assetWithProof.leafOwner,
    currentMetadata: assetWithProof.metadata,
    updateArgs,
    authority: umi.payer,
    collectionMint: publicKey(project?.collection || ""),
  }).sendAndConfirm(umi, { confirm: { commitment: 'finalized' } });

  return encode(update.signature);
};
