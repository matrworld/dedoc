import '../wallet-adapter/styles.css';

import { useWallet } from '@solana/wallet-adapter-react';
import {
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';

import { BookText } from 'lucide-react';

export function Nav() {
    const { publicKey, connected } = useWallet();
  
    return (
      <nav className="sticky top-0 w-full p-3 z-10 nav">
        <div className=" flex justify-between items-center flex-wrap">
          <div className="h-8 w-8 relative">
            <a href="/">
                <h2 className="text-xl font-semibold">DeDoc</h2>
            </a>
          </div>
          <div className="flex gap-3 flex-wrap">
              <WalletMultiButton disabled={!import.meta.env.DEV}>
                    {connected ? `${publicKey?.toBase58().slice(0, 6)}...` : <>
                        <p>
                            Connect Wallet
                        </p>
                    </>}
              </WalletMultiButton>
          </div>
        </div>
      </nav>
    );
  }