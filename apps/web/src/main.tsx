import './styles.postcss';
import '@solana/wallet-adapter-react-ui/styles.css';

import { StrictMode } from 'react';
import { Routes, Route } from 'react-router-dom';

import { Home } from "./routes/home";
import { Projects } from "./routes/projects";
import { Project } from "./routes/project";

import * as ReactDOM from "react-dom";
import { HashRouter, useLocation } from "react-router-dom";

import { useMemo } from 'react'

import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { BookText } from 'lucide-react';

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Providers
function Root() {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <StrictMode>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={[]}>
              <WalletModalProvider>
                <HashRouter basename="/">
                  <App />
                </HashRouter>
              </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
    </StrictMode>
  )
}

function Nav() {
  const { publicKey, connected } = useWallet();

  return (
    <nav className="sticky top-0 w-full p-5 z-10">
      <div className=" flex justify-between items-center ">
        <div className="h-8 w-8 relative">
          <a href="/">
              <h2 className="text-xl font-semibold">DeDoc</h2>
          </a>
        </div>
        <div className="flex gap-3 flex-wrap">
            <a href="/docs" className="btn btn-outline">
                <span>
                    <BookText size={16} />
                </span>
                Docs
            </a>
            {connected && <a href="/#/projects" className="btn btn-outline">Projects</a>}
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

// Content
function App() {
  const location = useLocation();
  const { connected } = useWallet();

  return (
    <>
      <Nav />
      <main className="min-h-screen mx-auto max-w-5xl py-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="projects" element={<Projects />} />
            <Route path="project/:id" element={<Project />} />
          </Routes>
      </main>
    </>
  )
}

root.render(<Root />);
