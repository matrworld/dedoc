import { WebIrys } from "@irys/sdk";
 
export const useIrys = async (wallet: any): Promise<WebIrys> => {
	// Devnet RPC URLs change often, use a recent one from https://chainlist.org
	const rpcURL = "https://devnet.helius-rpc.com/?api-key=2cb827e8-a527-4f73-a7b8-15e78ff27e40";
 
	const client = { rpcUrl: rpcURL, name: "solana", provider: wallet };
	const webIrys = new WebIrys({ url: "https://devnet.irys.xyz", token: "solana", wallet });
	await webIrys.ready();
	return webIrys;
};
