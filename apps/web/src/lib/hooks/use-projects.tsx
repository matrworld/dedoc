import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { type Umi, some, PublicKey, type KeypairSigner } from '@metaplex-foundation/umi';

import type {
    Project,
    PageMetadata,
    PageNode,
    PageTree
} from "@dedoc/sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { randomId } from '../util';
import { createCollection,  getUser, merkleTreePublic, mint, type Collection } from '@dedoc/sdk';
import { publicKey } from "@metaplex-foundation/umi";
import { useUmi } from "./use-umi";
import { updateProject as updateProjectNft } from "@dedoc/sdk";
import {
    getAssetWithProof,
    updateMetadata,
    UpdateArgsArgs,
  } from '@metaplex-foundation/mpl-bubblegum';
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
    openNewProject: () => {},
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
    openNewProject: () => void,
}>(DEFAULT_CONTEXT());

export function useProjects() { 
    return useContext(ProjectContext);
}

const openInitializeAccountModal = () => { 
    // @ts-expect-error
    document?.getElementById('create_account_modal')?.showModal()
}

export const openNewProject = () => {
    // @ts-expect-error
    document?.getElementById('new_project_modal')?.showModal()
}

function NewProjectModal({ createProject }: { createProject: (projectName: string) => void }) {
    let projectNameInput: HTMLInputElement | null = null;

    return (
        <dialog id="new_project_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Create Project</h3>
                <p className="py-3">Create and mint a new project.</p>
                <input required type="text" placeholder="Project Name" className="input input-bordered w-full" ref={(input) => { projectNameInput = input; }} />
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn btn-outline" onClick={() => projectNameInput && createProject(projectNameInput.value)}>Save</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
}

function InitializeAccountModal({ createAccount }: { createAccount: () => void }) {
    return (
        <dialog id="create_account_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Create Account</h3>
                <p className="py-3">Initialize your account to start creating projects.</p>
                <div className="modal-action">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-outline" onClick={createAccount}>Create</button>
                </form>
                </div>
            </div>
        </dialog>
    )
}

export function ProjectsProvider(props: { children: React.ReactNode }) {
    const [ projects, setProjects ] = useState<Project[]>([]);
    const [ selectedProject, setSelectedProject ] = useState<string>("");
    const [ selectedPage, setSelectedPage ] = useState<string>("");
    const wallet = useWallet();
    const umi = useUmi(wallet);
    const [ collections, setCollections ] = useState<Collection[]>([]);

    const [ showErrorToast, setSHowErrorToast ] = useState(false);
    const [ showSuccessToast, setShowSuccessToast ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);

    const showSuccess = () => {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 2000);
    }

    const showError = () => {
        setSHowErrorToast(true);
        setTimeout(() => setSHowErrorToast(false), 2000);
    }

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

    async function saveProject() {
        if(!project) return;

        try {
            setIsLoading(true);

            const jsonUri = await umi.uploader.uploadJson(project);

            const assetWithProof = await getAssetWithProof(umi, publicKey(project.id));
          
            const updateArgs: UpdateArgsArgs = {
              name: some(project.name || assetWithProof.metadata.name),
              uri: some(jsonUri || assetWithProof.metadata.uri),
            };
          
            const update = await updateMetadata(umi, {
              ...assetWithProof,
              leafOwner: assetWithProof.leafOwner,
              currentMetadata: assetWithProof.metadata,
              updateArgs,
              authority: umi.payer,
              collectionMint: publicKey(project?.collection || ""),
            }).sendAndConfirm(umi, { confirm: { commitment: 'finalized' } });
          
            showSuccess();
        } catch (error) {
            showError();

            console.error(error);
        } finally {
            setIsLoading(false);
        }

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
            openNewProject,
        }}>
            {props.children}
            
            {isLoading && (
                <div className="toast toast-end">
                    <div className="alert">
                        <span className="loading loading-spinner loading-sm"></span>
                        <span>Loading...</span>
                    </div>
                </div>
            )}
            <NewProjectModal createProject={createProject} />
            <InitializeAccountModal createAccount={createAccount}/> 
        </ProjectContext.Provider>
    )
}