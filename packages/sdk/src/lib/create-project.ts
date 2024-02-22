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
import ora from 'ora';
import chalk from 'chalk';
import cliProgress from 'cli-progress';
import { formatFinalSummary } from './utils/test-final-summary';

export const createProject = async (
  rpc: string,
  privateKey: string,
  config: {
    name: string;
    description: string;
    theme?: Theme | 'dark';
  }
) => {
  const spinner = ora('Initializing project...').start();
  const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );

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

    progressBar.start(6, 0);
    spinner.text = 'Creating collection...';
    const collectionMint = await createCollection(umi, {
      name: config.name,
      description: 'DeDoc NFT Collection',
      image: 'https://arweave.net/iP8xMGeXpydnvuGlucOKKprOdR-jt7UYvKdLGNkGh74',
    });
    if (!collectionMint) {
      throw new Error('Failed to create collection');
    }
    progressBar.update(1);
    console.log(
      chalk.green('Collection created: '),
      collectionMint.publicKey.toString()
    );

    spinner.text = 'Creating project config json...';
    const projectConfigUri = await createProjectConfigUri({
      name: config.name,
      description: config.description,
      theme: 'dark',
      image: 'https:/arweave.net/iP8xMGeXpydnvuGlucOKKprOdR-jt7UYvKdLGNkGh74',
      creator: '',
    });
    progressBar.update(2);
    console.log(
      chalk.green('Project config json created!\nUri: '),
      projectConfigUri
    );

    spinner.text = 'Uploading project config json...';
    const projectConfig = await umi.uploader.uploadJson(projectConfigUri);
    console.log(chalk.green('Project config uploaded!\nUri: ', projectConfig));
    progressBar.update(3);
    spinner.text = 'Creating merkle tree...';
    const { merkleTree } = await createMerkleTree(umi);
    console.log(
      chalk.green('Merkle tree created:\n', merkleTree.publicKey.toString())
    );
    progressBar.update(4);

    spinner.text = 'Minting project config...';

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
    console.log(chalk.green('Project config minted:\n', assetId));
    progressBar.update(5);
    spinner.text = 'Updating project config...';
    const updateProject = await update(umi, collectionMint, assetId, {
      name: 'New Name',
    });

    console.log(chalk.green('Project config updated!\n', updateProject));
    progressBar.update(6);
    spinner.succeed('Project setup complete!');
    console.log(formatFinalSummary({ 
      collectionMint, 
      projectConfigUri, 
      projectConfig, 
      merkleTree, 
      assetId, 
      updateProject 
    }));
  } catch (error) {
    spinner.fail(chalk.red('Failed to create project'));
    console.error(error);
  }
};
