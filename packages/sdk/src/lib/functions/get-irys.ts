import { WebIrys } from "@irys/sdk";
import { useWallet } from "@solana/wallet-adapter-react";
const wallet = useWallet();
 
export const getIrys = async (userWallet: any): Promise<WebIrys> => {
	const rpcURL = "https://devnet.helius-rpc.com/?api-key=2cb827e8-a527-4f73-a7b8-15e78ff27e40";
	const wallet = { rpcUrl: rpcURL, name: "solana", provider: userWallet};
	const webIrys = new WebIrys({ url: "https://devnet.irys.xyz", token: "solana", wallet });
	await webIrys.ready();
	return webIrys;
};