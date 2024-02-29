import { createContext, useContext, useEffect, useState, useMemo } from "react";

import type {
    Project,
    PageMetadata,
    PageNode,
    PageTree
} from "../types";
import { useWallet } from "@solana/wallet-adapter-react";
import { randomId } from '../util';
import { createCollection,  getUser, merkleTreePublic, mint, type Collection } from '@dedoc/sdk';
import { KeypairSigner, publicKey } from "@metaplex-foundation/umi";
import { useUmi } from "./use-umi";

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

const openInitializeAccountModal = () => { 
    // @ts-expect-error
    document?.getElementById('create_account_modal')?.showModal()
}

function NewProjectModal({ createProject }: { createProject: (projectName: string) => void }) {
    const [projectName, setProjectName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateProject = async () => {
        if (!projectName.trim()) return;
        setIsLoading(true);
        await createProject(projectName);
        setIsLoading(false);

        setTimeout(() => {
            setProjectName('');
            const modal = document.getElementById('new_project_modal');
            //@ts-expect-error
            if (modal) modal.close();
        }, 1000);
    };

    return (
        <dialog id="new_project_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Create Project</h3>
                <p className="py-3">Create and mint a new project.</p>
                <input
                    required
                    type="text"
                    placeholder="Project Name"
                    className="input input-bordered w-full"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    disabled={isLoading}
                />
                <div className="modal-action">
                    {isLoading ? (
                        <span className="loading loading-spinner my-2 loading-lg"></span>
                    ) : (
                        <button className="btn btn-outline" onClick={handleCreateProject} disabled={!projectName.trim()}>Save</button>
                    )}
                </div>
            </div>
        </dialog>
    );
}


function InitializeAccountModal({ createAccount }: { createAccount: () => Promise<KeypairSigner | undefined> }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateAccount = async () => {
        setIsLoading(true);
        await createAccount();
        setIsLoading(false);

        setTimeout(() => {
            const modal = document.getElementById('create_account_modal');
            //@ts-expect-error
            if (modal) modal.close();
        }, 1000);
    };

    return (
        <dialog id="create_account_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Create Account</h3>
               
                        <p className="py-3">Initialize your account to start creating projects.</p>
                        <div className="modal-action">
                            {isLoading ? (
                                <span className="loading loading-spinner my-2 loading-lg"></span>
                            ) : (
                                <button className="btn btn-outline" onClick={handleCreateAccount}>Create</button>
                            )}
                        </div>
            </div>
        </dialog>
    );
}
export function ProjectsProvider(props: { children: React.ReactNode }) {
    const [ projects, setProjects ] = useState<Project[]>([]);
    const [ selectedProject, setSelectedProject ] = useState<string>("");
    const [ selectedPage, setSelectedPage ] = useState<string>("");
    const wallet = useWallet();
    const umi = useUmi(wallet);
    const [ collections, setCollections ] = useState<Collection[]>([]);

    const project = projects.find((project) => project.id === selectedProject) || null
    const page = project?.pages.metadata[selectedPage] || null;

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

        if(childIndex === undefined || !parent) return;

        const newIndex = direction === "up" ? childIndex - 1 : childIndex + 1;

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

    const fetchProjects = async () => {
        const [ collection ] = await getUser(umi);

        if(!collection) return openInitializeAccountModal();

        setProjects(collection.projects);
    };

    const createProject = async (projectName: string) => {
        const result = await getUser(umi);
        setCollections(result);

        const [ collection ] = result;
        const key = publicKey(collection.id);

        if(!key) return;

        const minted = await mint(
            merkleTreePublic,
            key,
            { name: projectName },
            umi
        );

        fetchProjects();
    };
   
    const createAccount = async () => {
        const collection = await createCollection(umi);
        return collection;
    } 
    
    async function selectProject(projectId: string) {
        setSelectedProject(projectId);
    };

    async function deleteProject(projectId: string) {};

    useEffect(() => {
        if (wallet.connected) {
            fetchProjects();
        }
    }, [wallet.connected]);

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

            <NewProjectModal createProject={createProject} />
            <InitializeAccountModal createAccount={createAccount}/> 
        </ProjectContext.Provider>
    )
}