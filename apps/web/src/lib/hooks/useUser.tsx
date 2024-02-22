import { createContext, useContext, useState } from "react";

import type {
    Team,
} from "../types";

const DEFAULT_CONTEXT = () => ({
    teams: [],
    selectedTeam: "",
    getTeams: async () => {},
    selectTeam: () => {},
    updateTeam: async () => {},
    createTeam: async () => {},
    deleteTeam: async () => {},
});

const UserContext = createContext<{
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

export function useUser() { 
    return useContext(UserContext);
}

export function UserProvider(props: { children: React.ReactNode }) {
    const [ teams, setTeams ] = useState<Team[]>([]);
    const [ selectedTeam, setProject ] = useState<string>("");

    async function getTeams() {};
    async function selectTeam(mintId: string) {};
    async function updateTeam(mintId: string, metadata: Team) {};
    async function createTeam(metadata: Team) {};
    async function deleteTeam(mintId: string) {};
    
    return (
        <UserContext.Provider value={{
            teams,
            selectedTeam,
            getTeams,
            selectTeam,
            updateTeam,
            createTeam,
            deleteTeam,
        }}>
            {props.children}
        </UserContext.Provider>
    )
}