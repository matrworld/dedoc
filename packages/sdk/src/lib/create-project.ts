import { Theme } from 'daisyui';
import { createProjectConfig } from '../utils/create-project-config';
import { createCollection } from './create-collection';
import {
  createSignerFromKeypair,
  keypairIdentity,
} from '@metaplex-foundation/umi';
import { base64ToUint8Array } from './keypair';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mintToCollectionV1 } from '@metaplex-foundation/mpl-bubblegum';
import { createMerkleTree } from './create-merkle-tree';

export const createProject = async (
  rpc: string,
  privateKey: string,
  config: {
    name: string;
    description: string;
    theme?: Theme | 'dark';
  }
) => {
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
  console.log('Starting project generation...');
  const collectionMint = await createCollection(rpc, privateKey, {
    name: config.name,
    description: 'DeDoc NFT Collection',
    image: 'https://arweave.net/iP8xMGeXpydnvuGlucOKKprOdR-jt7UYvKdLGNkGh74',
  });
  if (!collectionMint) {
    return;
  }
  console.log('Creating project config...');
  const projectConfigJson = await createProjectConfig({
    name: config.name,
    theme: 'dark',
    image: 'https:/arweave.net/iP8xMGeXpydnvuGlucOKKprOdR-jt7UYvKdLGNkGh74',
    creator: '',
  });
  console.log('Uploading project config...');
  const projectConfig = await umi.uploader.uploadJson(projectConfigJson);
  console.log('Project config uploaded: ', projectConfig);
  console.log('Creating merkle tree...');
  const { merkleTree } = await createMerkleTree(rpc, privateKey, {
    maxBufferSize: 14,
    maxDepth: 64,
  })
  console.log('Merkle tree created: ', merkleTree.publicKey);
  console.log('Creating project config...');
  let attempts = 0;
  console.log("Collection mint: ", collectionMint.publicKey, merkleTree.publicKey, projectConfig, umi.identity.publicKey)
  const merkleSigner = createSignerFromKeypair(umi, merkleTree);
      await mintToCollectionV1(umi, {
        leafOwner: umi.payer.publicKey,
        merkleTree: merkleTree.publicKey,
        collectionMint: collectionMint.publicKey,
        treeCreatorOrDelegate: umi.payer,
        metadata: {
          name: '_dedoc',
          symbol: 'DEDOC',
          uri: projectConfig,
          sellerFeeBasisPoints: 0,
          collection: { key: collectionMint.publicKey, verified: false },
          creators: [
            { address: umi.payer.publicKey, verified: false, share: 100 },
          ],
        },
        collectionAuthority: umi.payer
      }).sendAndConfirm(umi);
      
};
