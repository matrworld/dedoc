import 'dotenv/config'

import { keypairIdentity } from '@metaplex-foundation/umi';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createMerkleTree } from "../src/lib/functions/create-merkle-tree"

import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

(async () => {
    const umi = createUmi(process.env.PUBLIC_RPC_URL, { commitment: 'finalized' });
    const keypair = umi.eddsa.createKeypairFromSecretKey(Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY)));
    umi
      .use(keypairIdentity(keypair))
      .use(irysUploader({ priceMultiplier: 1.5 }))
      .use(mplTokenMetadata())
      .use(dasApi());

      console.log('Creating merkle tree...');
      const { merkleTree } = await createMerkleTree(umi);
      console.log(
        'Merkle tree created:\n', merkleTree.publicKey.toString()
      );
})();