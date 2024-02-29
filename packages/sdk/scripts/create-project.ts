import 'dotenv/config'

import { createProject } from "@dedoc/sdk";

(async () => {
    const result = await createProject(
        process.env.PUBLIC_RPC_URL,
        process.env.PRIVATE_KEY,
        {
            name: "DeDoc",
            description: "DeDoc NFT Collection",
        }
    );
})();