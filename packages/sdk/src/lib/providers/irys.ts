import Irys from '@irys/sdk';

import { base64ToUint8Array } from '../utils/keypair';

export const createIrys = () => {
  const irys = new Irys({
    url: 'https://node2.irys.xyz',
    key: base64ToUint8Array(process.env.PRIVATE_KEY),
    token: 'solana',
  });
};
