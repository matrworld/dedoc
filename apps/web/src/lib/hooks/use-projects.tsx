import { createContext, useContext, useEffect, useState, useMemo } from "react";

import type {
    Project,
    PageMetadata,
    PageNode,
    PageTree
} from "../types";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTeam } from "./use-team";
import { randomId } from '../util';

import { useUmi } from "./use-umi";
import { get } from "http";

const DEFAULT_CONTEXT = () => ({
    projects: [],
    project: null,
    page: null,
    selectedProject: "",
    selectedPage: "",
    
    addPage: () => {},
    setProjects: () => {},
    selectPage: () => {},
    updatePage: () => {},
    deletePage: () => {},
    updateProject: async () => {},
    createProject: async () => {},
    deleteProject: async () => {},
    selectProject: () => {},
    saveProject: () => {},
    moveCurrentPage: () => {},
});

const ProjectContext = createContext<{
    // State
    projects: Project[],
    project: Project | null,
    page: PageMetadata | null,
    selectedProject: string,
    selectedPage: string,
    
    // User actions
    addPage: (path: number[]) => void,
    setProjects: (projects: Project[]) => void,
    selectPage: (pageId: string) => void,
    deletePage: () => void,
    updatePage: (pageId: string, metadata: PageMetadata) => void,
    updateProject: (projectId: string, metadata: Project) => void,
    createProject: (projectName: string, teamId: string) => Promise<void>,
    deleteProject: (projectId: string) => Promise<void>,
    selectProject: (projectId: string) => void,
    saveProject: () => void,
    moveCurrentPage: (direction: "up" | "down") => void,
}>(DEFAULT_CONTEXT());

export function useProjects() { 
    return useContext(ProjectContext);
}

export function ProjectsProvider(props: { children: React.ReactNode }) {
    const [ projects, setProjects ] = useState<Project[]>([]);
    const { selectedTeam } = useTeam();
    const [ selectedProject, setSelectedProject ] = useState<string>("JCE1t78oZoBF9jogeAjWHWorAKQtxHzQoXqiNnNZskYP");
    const [ selectedPage, setSelectedPage ] = useState<string>("d2hg2g2g2h");
    const wallet = useWallet();

    useEffect(() => {
        if(wallet.connected) {
            getProjects();
        }
    }, [selectedProject]);

    const project = projects.find((project) => project.id === selectedProject) || null
    const page = project?.pages.metadata[selectedPage] || null;

    const umi = useUmi(wallet);

    function selectPage(pageId: string) {
        setSelectedPage(pageId);
    }

    function getPage(
        path: number[],
        pages: PageTree,
    ): PageNode {
        const [pathIdx, ...nextPath] = path;
    
        const current = pages[pathIdx];
    
        console.log(path, {nextPath})
    
        if (!nextPath.length) {
            return current;
        }
    
        return getPage(
            nextPath,
            current.children,
        );
    }

    function addPage(
        path: number[],
    ) {
        if(!project) return;
    
        const updatedProject = project;
    
        let newPagesTree = project.pages.tree;
    
        const current = getPage(path, newPagesTree);
    
        const pageId = randomId();
    
        const pageNode: PageNode = {
            id: pageId,
            children: []
        };
    
        const pageMetadata = {
            name: `Page ${current?.children?.length + 1}`,
            content: ""
        };
    
        current.children.push(pageNode);
    
        updatedProject.pages.metadata[pageId] = pageMetadata;

        selectPage(pageId);
    
        setProjects([
            ...projects.filter((project) => project.id !== updatedProject.id),
            updatedProject
        ]);
    };

    function updateProject(projectId: string, metadata: Project) {
        setProjects([
            ...projects.filter((project) => project.id !== projectId),
            metadata
        ]);
    };

    function updatePage(pageId: string, metadata: PageMetadata) {
        if(!project) return;

        updateProject(project.id, {
            ...project,
            pages: {
                ...project?.pages,
                metadata: {
                    ...project?.pages.metadata,
                    [pageId]: {
                        ...project?.pages.metadata[pageId],
                        ...metadata
                    }
                }
            }
        })
    }

    function deletePage() {
        if(!project) return;

        const updatedProject = project;

        const updatedPagesTree = project.pages.tree;

        const removePage = (pageId: string, pages: PageTree) => {
            return pages.filter((page) => {
                if(page.id === pageId) {
                    return false;
                }

                page.children = removePage(pageId, page.children);

                return true;
            });
        }

        updatedProject.pages.tree = removePage(selectedPage, updatedPagesTree);

        delete updatedProject.pages.metadata[selectedPage];

        setProjects([
            ...projects.filter((project) => project.id !== updatedProject.id),
            updatedProject
        ]);
    }

    function saveProject() {
        const serialized = JSON.stringify(project);

        const lsKey = `project:${wallet?.publicKey?.toBase58()}:${project?.id}`;

        const saves = JSON.parse(window.localStorage.getItem(lsKey) || "[]");

        saves.push(serialized);

        if(saves.length > 10) {
            saves.shift();
        }

        console.log(JSON.stringify(serialized));

        window.localStorage.setItem(lsKey, JSON.stringify(saves));
    }

    function moveCurrentPage(direction: "up" | "down") {
        if(!project) return;

        const newProject = project;

        function getPageParent(tree: PageTree, parent?: PageTree) {
            for(const node of tree) {
                if(node.id === selectedPage) {
                    return tree;
                }

                if(node.children.length) {
                    return getPageParent(node.children, tree);
                }
            }
        }

        const parent = getPageParent(newProject.pages.tree);

        const childIndex = parent?.findIndex((node) => node.id === selectedPage);

        console.log({ childIndex, parent })

        if(childIndex === undefined || !parent) return;

        const newIndex = direction === "up" ? childIndex - 1 : childIndex + 1;

        console.log({ newIndex })

        if(newIndex < 0 || newIndex >= parent.length) return;

        const itemA = parent[childIndex];
        const itemB = parent[newIndex];

        parent[childIndex] = itemB;
        parent[newIndex] = itemA;

        setProjects([
            ...projects.filter((project) => project.id !== newProject.id),
            newProject
        ]);
    }
    
    async function getProjects() {
        setProjects([
            {
                id: "JCE1t78oZoBF9jogeAjWHWorAKQtxHzQoXqiNnNZskYP",
                name: "Test",
                theme: "dark",
                image: "",
                deployments: {
                    production: "",
                    staging: "",
                },
                pages: {
                    tree: [
                        {
                            id: "root",
                            children: [
                                {
                                    id: "d2hg2g2g2h",
                                    children: []
                                }
                            ]
                        }
                    ],
                    metadata: {
                        "d2hg2g2g2h": {
                            name: "Page 1",
                            content: ""
                        }
                    },
                }
            }
        ]);
    };

    async function selectProject(projectId: string) {};
    async function createProject(projectName: string, teamId: string) {};
    async function deleteProject(projectId: string) {};
    
    useEffect(() => {
        getProjects();
    }, [selectedTeam, wallet?.connected]);

    return (
        <ProjectContext.Provider value={{
            projects,
            project,
            page,
            selectedProject,
            selectedPage,
            addPage,
            setProjects,
            selectPage,
            updatePage,
            selectProject,
            updateProject,
            createProject,
            deleteProject,
            saveProject,
            moveCurrentPage,
            deletePage,
        }}>
            {props.children}
        </ProjectContext.Provider>
    )
}