import { Theme } from 'daisyui';
import { createProjectConfig } from '../utils/create-project-config';
import { createCollection } from './create-collection';
import { keypairIdentity } from '@metaplex-foundation/umi';
import { base64ToUint8Array } from './keypair';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

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
  await createCollection(rpc, privateKey, {
    name: config.name,
    description: 'DeDoc NFT Collection',
    image: 'https://arweave.net/1234',
  });
  console.log('Creating project config...');
  const projectConfigJson = await createProjectConfig({
    name: config.name,
    theme: 'dark',
    image: 'https://arweave.net/1234',
    creator: '',
  });
  console.log('Uploading project config...');
  const projectConfig = await umi.uploader.uploadJson(projectConfigJson);
  console.log('Project config uploaded: ', projectConfig);
};
