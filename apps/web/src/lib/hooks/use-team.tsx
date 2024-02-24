import { createContext, useContext, useEffect, useState } from "react";

import type {
    Team,
} from "../types";
import { useWallet } from "@solana/wallet-adapter-react";

import { useUmi } from "./use-umi";

const DEFAULT_CONTEXT = () => ({
    teams: [],
    selectedTeam: "",
    getTeams: async () => {},
    selectTeam: () => {},
    updateTeam: async () => {},
    createTeam: async () => {},
    deleteTeam: async () => {},
});

const TeamContext = createContext<{
    // State
    teams: Team[],
    selectedTeam: string,

    // User actions
    getTeams: () => Promise<void>,
    selectTeam: (mintId: string) => void,
    updateTeam: (mintId: string, metadata: Team) => Promise<void>,
    createTeam: (metadata: Team) => Promise<void>,
    deleteTeam: (mintId: string) => Promise<void>,
}>(DEFAULT_CONTEXT());

export function useTeam() { 
    return useContext(TeamContext);
}

export function TeamProvider(props: { children: React.ReactNode }) {
    const [ teams, setTeams ] = useState<Team[]>([]);
    const [ selectedTeam, setSelectedTeam ] = useState<string>("");

    const wallet = useWallet();
    const umi = useUmi();

    async function getTeams() {
        if (!umi) return;

        const response = await umi.rpc.getAssetsByOwner({
            owner: umi.identity.publicKey,
        });

        console.log(response, "teams");
    };
    async function selectTeam(mintId: string) {};
    async function updateTeam(mintId: string, metadata: Team) {};
    async function createTeam(metadata: Team) {};
    async function deleteTeam(mintId: string) {};

    return (
        <TeamContext.Provider value={{
            teams,
            selectedTeam,
            getTeams,
            selectTeam,
            updateTeam,
            createTeam,
            deleteTeam,
        }}>
            {props.children}
        </TeamContext.Provider>
    )
}