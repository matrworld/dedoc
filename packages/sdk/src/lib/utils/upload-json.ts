import { ShdwDrive, ShadowFile } from "@shadow-drive/sdk";
import { Connection, Keypair } from "@solana/web3.js";
import { base64ToUint8Array } from "./keypair";
import * as anchor from "@project-serum/anchor";

export const uploadJson = async (json: any) => {
    let secretKey = Uint8Array.from(base64ToUint8Array("3DRu3UuQ8zmPg6Jbs7rBwJsQBXLJsPrKMD4b6MEzELeHSVxmejTPHwD1EdyNCq37PhBQjTnxiFKFiVbd5yr8iaKT"));
    let keypair = Keypair.fromSecretKey(secretKey);
    const connection = new Connection(
        "https://mainnet.helius-rpc.com/?api-key=954d1630-5548-45f7-83b8-b3e890beb7ad"
    );
    const wallet = new anchor.Wallet();

    const drive = await new ShdwDrive(connection, keypair).init()
    const newAcct = await drive.createStorageAccount("dedoc-test", "1MB");
    const fileBuff = json;
    const acctPubKey = new anchor.web3.PublicKey(
        newAcct.shdw_bucket
    );
    console.log('Account Public Key: ', acctPubKey.toBase58())
    const fileToUpload: ShadowFile = {
        name: "DEDOC COLLECTION JSON",
        file: fileBuff,
    };
    console.log('UPLOADING FILE: ', fileToUpload);
    const uploadFile = await drive.uploadFile(acctPubKey, fileToUpload);
    console.log('UPLOAD FILE: ', uploadFile);
    return uploadFile.finalized_locations[0]
}