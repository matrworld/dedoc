import bs58 from 'bs58';

export const base64ToUint8Array = (base64: string) => new Uint8Array(Array.from(bs58.decode(String(base64))));

export const getKeypair = () => base64ToUint8Array(process.env.PRIVATE_KEY);