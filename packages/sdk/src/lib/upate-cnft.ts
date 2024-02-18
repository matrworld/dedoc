import {
    getAssetWithProof,
    updateMetadata,
    UpdateArgsArgs,
  } from '@metaplex-foundation/mpl-bubblegum'
import { publicKey, some } from '@metaplex-foundation/umi'
  
  export const updateCnft = async (
    umi: any,
    collectionMint: any,
    assetId: any,
    config: { 
        name?: string;
        uri?: string;
    }
    
  ) => {
  console.log(assetId)
  const assetWithProof = await getAssetWithProof(umi, assetId)
  const updateArgs: UpdateArgsArgs = {
    name: some(config.name || assetWithProof.metadata.name),
    uri: some(config.uri || assetWithProof.metadata.uri),
  }
  const update = await updateMetadata(umi, {
    ...assetWithProof,
    leafOwner: assetWithProof.leafOwner,
    currentMetadata: assetWithProof.metadata,
    updateArgs,
    authority: umi.payer,
    collectionMint: collectionMint.publicKey,
  }).sendAndConfirm(umi,  { confirm: { commitment: 'finalized' } })

  return update;

}