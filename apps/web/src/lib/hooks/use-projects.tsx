import { createContext, useContext, useEffect, useState } from "react";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { web3JsRpc } from '@metaplex-foundation/umi-rpc-web3js';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import type {
    Project,
} from "../types";
import { useWallet } from "@solana/wallet-adapter-react";

import { useUmi } from "./use-umi";

const DEFAULT_CONTEXT = () => ({
    projects: [],
    selectedProject: "",

    getProjects: async () => {},
    updateProject: async () => {},
    createProject: async () => {},
    deleteProject: async () => {},
    selectProject: () => {},
});

const ProjectContext = createContext<{
    // State
    projects: Project[],
    selectedProject: string,

    // User actions
    getProjects: () => Promise<void>,
    updateProject: (projectId: string, metadata: Project) => void,
    createProject: (projectName: string, teamId: string) => Promise<void>,
    deleteProject: (projectId: string) => Promise<void>,
    selectProject: (projectId: string) => void,
}>(DEFAULT_CONTEXT());

export function useProjects() { 
    return useContext(ProjectContext);
}

export function ProjectsProvider(props: { children: React.ReactNode }) {
    const [ projects, setProjects ] = useState<Project[]>([]);
    const [ selectedProject, setSelectedProject ] = useState<string>("");

    const umi = useUmi();

    async function getProjects() {
        if (!umi?.rpc?.searchAssets) return;

        const response = await umi?.rpc?.getAssetsByOwner({
            owner: umi?.identity?.publicKey,
        });

        console.log("projects", response);
    };

    async function selectProject(projectId: string) {};
    async function updateProject(projectId: string, metadata: Project) {};
    async function createProject(projectName: string, teamId: string) {};
    async function deleteProject(projectId: string) {};
    
    return (
        <ProjectContext.Provider value={{
            projects,
            selectedProject,
            getProjects,
            selectProject,
            updateProject,
            createProject,
            deleteProject,
        }}>
            {props.children}
        </ProjectContext.Provider>
    )
}