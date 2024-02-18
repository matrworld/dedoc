import { Theme } from 'daisyui';
import { createProjectConfig } from '../utils/create-project-config';
import { createCollection } from './create-collection';
import {
  keypairIdentity,
} from '@metaplex-foundation/umi';
import { base64ToUint8Array } from './keypair';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createMerkleTree } from './create-merkle-tree';
import { mintToCollection } from './mint-to-collection';
import { updateCnft } from './upate-cnft';
import { publicKey } from '@metaplex-foundation/umi';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

export const createProject = async (
  rpc: string,
  privateKey: string,
  config: {
    name: string;
    description: string;
    theme?: Theme | 'dark';
  }
) => {
  const umi = createUmi(rpc, { commitment: 'finalized' });
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
    .use(mplTokenMetadata())
    .use(dasApi());
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
  console.log('Uploading project config json...');
  const projectConfig = await umi.uploader.uploadJson(projectConfigJson);
  console.log('Project config uploaded: ', projectConfig);
  console.log('Creating merkle tree...');
  const { merkleTree } = await createMerkleTree(rpc, privateKey, {
    maxBufferSize: 14,
    maxDepth: 64,
  });
  console.log('Minting project config...');
  const mint = await mintToCollection(
    merkleTree,
    collectionMint,
    projectConfig,
    umi
  );
  console.log('Project config minted: ', mint.assetId[0]);
  console.log('Updating project config...');
  const update = await updateCnft(umi, collectionMint, mint.assetId[0], { name: "New Name"} )
  console.log('Project config updated: ', update.signature.toString());
};
