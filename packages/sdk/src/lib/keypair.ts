import bs58 from 'bs58';

export const base64ToUint8Array = (base64: string) => new Uint8Array(Array.from(bs58.decode(String(base64))));
