import type { WebIrys } from "@irys/sdk";
import { getIrys } from "../functions/get-irys";
import { Umi } from "@metaplex-foundation/umi";


export const uploadJson = async (json: any, wallet: any) => {
    const irys = await getIrys(wallet);
    await irys.ready()
    const jsonUri = await irys.uploader.uploadFile(json)
    console.log('jsonUri:', jsonUri)
    return jsonUri;
}