import { Theme } from 'daisyui';
import { createProjectConfigUri } from './utils/create-project-uri';
import { createCollection } from './functions/create-collection';
import { keypairIdentity } from '@metaplex-foundation/umi';
import { base64ToUint8Array } from './utils/keypair';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createMerkleTree } from './functions/create-merkle-tree';
import { mint } from './functions/mint';
import { update } from './functions/update';
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

  try {
    const umi = createUmi(rpc, { commitment: 'finalized' });
    const keypair = umi.eddsa.createKeypairFromSecretKey(
      base64ToUint8Array(privateKey)
    );
    umi
      .use(keypairIdentity(keypair))
      .use(irysUploader({ priceMultiplier: 1.5 }))
      .use(mplTokenMetadata())
      .use(dasApi());

    console.log('Creating collection...');
    const collectionMint = await createCollection(umi, {
      name: config.name,
      description: 'DeDoc NFT Collection',
      image: 'https://arweave.net/iP8xMGeXpydnvuGlucOKKprOdR-jt7UYvKdLGNkGh74',
    });
    if (!collectionMint) {
      throw new Error('Failed to create collection');
    }
    console.log(
      'Collection created: ',
      collectionMint.publicKey.toString()
    );

    console.log( 'Creating project config json...');
    const projectConfigUri = await createProjectConfigUri({
      name: config.name,
      description: config.description,
      theme: 'dark',
      image: 'https:/arweave.net/iP8xMGeXpydnvuGlucOKKprOdR-jt7UYvKdLGNkGh74',
      creator: '',
    });
    console.log(
      'Project config json created!\nUri: ',
      projectConfigUri
    );

    console.log('Uploading project config json...');
    const projectConfig = await umi.uploader.uploadJson(projectConfigUri);
    console.log('Project config uploaded!\nUri: ', projectConfig);
    console.log('Creating merkle tree...');
    const { merkleTree } = await createMerkleTree(umi);
    console.log(
      'Merkle tree created:\n', merkleTree.publicKey.toString()
    );

    console.log('Minting project config...');

    const mintConfig = { 
      name: config.name, 
      uri: projectConfig
    }
    const assetId = await mint(
      merkleTree,
      collectionMint,
      mintConfig,
      umi
    );
    console.log('Project config minted:\n', assetId);
    console.log('Updating project config...');
    const updateProject = await update(umi, collectionMint, assetId, {
      name: 'New Name',
    });

    console.log('Project config updated!\n', updateProject);
  } catch (error) {
    console.error(error);
  }
};
