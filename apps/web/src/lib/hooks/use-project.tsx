import { createContext, useContext, useState } from "react";

import type {
    Project,
    ProjectMetadata,
    ProjectEnvironment,
    PageTreePath,
    PageMetadata,
} from "../types";

const DEFAULT_CONTEXT = () => ({
    project: {
        name: "",
        theme: "dark",
        image: "",
        deployments: {
            production: "",
            staging: "",
        },
        pages: {
            tree: [],
            metadata: {},
        }
    },
    selectedPage: [],

    getProject: async () => {},
    updateProjectMetadata: async () => {},
    deployProject: async () => {},
    deleteProject: async () => {},

    addPage: () => {},
    selectPage: () => {},
    updatePage: () => {},
});

const ProjectContext = createContext<{
    // State
    project: Project,
    selectedPage: PageTreePath,

    // Project actions
    getProject: (mintId: string) => Promise<void>,
    updateProjectMetadata: (metadata: ProjectMetadata) => Promise<void>,
    deployProject: (environment: ProjectEnvironment) => Promise<void>,
    deleteProject: () => Promise<void>,

    // Page actions
    addPage: (path: PageTreePath) => void,
    selectPage: (path: PageTreePath) => void,
    updatePage: (path: PageTreePath, data: PageMetadata) => void,
}>(DEFAULT_CONTEXT());

export function useProject() { 
    return useContext;
}

export function ProjectProvider(props: { children: React.ReactNode }) {
    const [ selectedPage, setSelectedPage ] = useState<PageTreePath>([0, 0]);
    const [ project, setProject ] = useState<Project>(DEFAULT_CONTEXT().project);

    async function getProject(mintId: string) {};
    async function updateProjectMetadata(metadata: ProjectMetadata) {};
    async function deployProject(environment: ProjectEnvironment) {};
    async function deleteProject() {};
    
    function addPage(path: PageTreePath) {};
    function selectPage(path: PageTreePath) {};
    function updatePage(path: PageTreePath, data: PageMetadata) {};

    
    
    return (
        <ProjectContext.Provider value={{
            project,
            selectedPage,
            getProject,
            updateProjectMetadata,
            deployProject,
            deleteProject,
            addPage,
            selectPage,
            updatePage,
        }}>
            {props.children}
        </ProjectContext.Provider>
    )
}