import 'dotenv/config'

import { createCollection } from "@dedoc/sdk";

(async () => {
    const result = await createCollection(
        process.env.PUBLIC_RPC_URL,
        process.env.PRIVATE_KEY,
        {
            name: "DeDoc",
            uri: "https://www.dedoc.com/",
            sellerFeeBasisPoints: 5.5,
        }
    );

    console.log(result);
})();