import './styles.css';

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
import {
    WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';

import { clusterApiUrl } from '@solana/web3.js';

import { Nav } from "./lib/components/nav";

import { ProjectProvider } from "./lib/hooks/useProject";

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Content
function App() {
  const location = useLocation();
  const { connected } = useWallet();

  return (
    <>
      <Nav />
      <main className="min-h-screen mx-auto py-10 px-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="project" element={<Projects />} />
            <Route path="project/:id" element={<Project />} />
          </Routes>
      </main>
    </>
  )
}

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
                  <ProjectProvider>
                    <App />
                  </ProjectProvider>
                </HashRouter>
              </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
    </StrictMode>
  )
}

root.render(<Root />);
