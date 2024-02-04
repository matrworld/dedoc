import 'dotenv/config'

import { createMerkleTree } from "@dedoc/sdk";

(async () => {
    const result = await createMerkleTree(
        process.env.PUBLIC_RPC_URL,
        process.env.PRIVATE_KEY,
        {
            maxDepth: 14,
            maxBufferSize: 64
        }
    );

    console.log(result);
})();