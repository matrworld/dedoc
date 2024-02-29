import '../wallet-adapter/styles.css';

import { useWallet } from '@solana/wallet-adapter-react';
import {
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { useLocation, useNavigate } from 'react-router-dom';

import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

export function Nav() {
    const { publicKey, connected } = useWallet();
    let location = useLocation();
    const navigate = useNavigate();

    // TODO: Auto logout
    // useEffect(() => {
    //   if(location.pathname.startsWith("/project") && !connected) {
    //     navigate("/");
    //   }
    // }, [location, connected]);

    return (
      <nav className="sticky top-0 w-full p-3 z-10 nav">
        <div className=" flex justify-between items-center flex-wrap">
          <div className="relative">
            {location.pathname.startsWith("/project/") ? (
              <a href="/#/project" className="flex items-center">
                <ArrowLeft size={16}/>
                <h2 className="text-sm font-semibold">All Projects</h2>
              </a>
            ) : (
              <a href="/">
                <h2 className="text-xl font-semibold">DeDoc</h2>
              </a>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
              {connected && !location.pathname.startsWith("/project") && (
                <a className="btn" href="/#/project">
                  My Projects
                </a>
              )}
              <WalletMultiButton>
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