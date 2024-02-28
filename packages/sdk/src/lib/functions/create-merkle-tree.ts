import { type Umi, generateSigner } from '@metaplex-foundation/umi';
import { createTree } from '@metaplex-foundation/mpl-bubblegum';

export async function createMerkleTree(umi: Umi) {
  const merkleTree = generateSigner(umi);
  const builder = await createTree(umi, {
    merkleTree,
    maxDepth: 14,
    maxBufferSize: 64,
    treeCreator: umi.payer,
  });
  await builder.sendAndConfirm(umi, { confirm: { commitment: 'finalized' } });
  return {
    merkleTree,
  };
}