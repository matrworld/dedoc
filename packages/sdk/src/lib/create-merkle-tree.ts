import {
  KeypairSigner,
  createSignerFromKeypair,
  generateSigner,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import { createTree } from '@metaplex-foundation/mpl-bubblegum';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { keypairIdentity } from '@metaplex-foundation/umi';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';

import { base64ToUint8Array } from './keypair';

export async function createMerkleTree(
  rpc: string,
  privateKey: string,
  config: {
    maxDepth: number;
    maxBufferSize: number;
  } = {
    // Default costs .25 SOL and fits 16k NFTs
    maxDepth: 14,
    maxBufferSize: 64,
  }
) {
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
  
  
  const merkleTree = generateSigner(umi);
  const builder = await createTree(umi, {
    merkleTree,
    maxDepth: 14,
    maxBufferSize: 64,
    treeCreator: umi.payer,
  })
  await builder.sendAndConfirm(umi);

  console.log('✅ Merkle tree created!\nMint: ', merkleTree.publicKey);

  return {
    merkleTree,
  };
}
