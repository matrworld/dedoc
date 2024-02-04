import Irys from "@irys/sdk";

import { Keypair, PublicKey } from '@solana/web3.js';

import 'dotenv/config';

import { base64ToUint8Array } from './keypair';

const irys = new Irys({
    url: "https://node2.irys.xyz",
    key: process.env.PRIVATE_KEY,
    token: 'solana'
});

const json = JSON.stringify(json);

try {
    const keypairBytes = toBytes(process.env.PRIVATE_KEY);

    const keypair = Keypair.fromSecretKey(keypairBytes);

    const balance = Number(await irys?.getBalance(keypair.publicKey.toBase58()));

    const uploadPrice = Number(await irys?.getPrice(new Blob([json]).size));

    if (balance < uploadPrice * 2) {
        await irys?.fund(Math.ceil(uploadPrice), 3);
    }
    
    const receipt = await irys.upload(json);

    console.log(receipt);
} catch (error) {
    console.error(error);
}