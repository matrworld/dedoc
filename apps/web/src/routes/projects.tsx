import { Plus } from "lucide-react";
import { useProjects } from "../lib/hooks/use-projects";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { createCollection,  getUser, merkleTreePublic, mint } from '@dedoc/sdk';
import { useUmi } from "../lib/hooks/use-umi";
import { publicKey } from "@metaplex-foundation/umi";

const openNewProject = () => {
    // @ts-expect-error
    document?.getElementById('new_project_modal')?.showModal()
}

const initializeNewAccount = () => { 
    // @ts-expect-error
    document?.getElementById('create_account_modal')?.showModal()
}

export function NewProjectModal({ createProject }: { createProject: (projectName: string) => void }) {
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


export function InitializeAccountModal({ createAccount }: { createAccount: () => void }) {
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

export function NewTeamModal()  {
    return (
        <dialog id="new_team_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Create Team</h3>
                <p className="py-3">Create and mint a new project.</p>
                <input type="text" placeholder="Project Name" className="input input-bordered w-full" />
                <div className="modal-action">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-outline">Save</button>
                </form>
                </div>
            </div>
        </dialog>
    )
}

function ProjectCard(props: { name: string, wallet: string }) {
    return (
        <a href="/#/project/4ehC" className="min-h-[10rem] flex flex-col justify-between bg-base-300 p-5 rounded-xl hover:opacity-50">
            <h3 className="font-semibold">
                {props.name}
            </h3>
            <div className="flex items-center gap-2 text-xs font-semibold">
                <div className="w-3 h-3 bg-green-400 rounded-full">
                </div>
                {props.wallet.slice(0, 6) + "..."}
            </div>
        </a>
    )
}

export function Projects()  {
    const wallet = useWallet();
    const umi = useUmi(wallet);
    const [userProjects, setUserProjects] = useState<any[]>([]);

    const fetchProjects = async () => {
        const assets = await getUser(umi);
        if (assets.length > 0 && assets[0].collections.length > 0 && assets[0].collections[0].projects.items) {
            setUserProjects(assets[0].collections[0].projects.items);
        } else {
            setUserProjects([]);
            if (assets.length === 0 || assets[0].collections.length === 0) {
                initializeNewAccount();
            }
        }
    };
    const getUserCollection = async () => {
        const assets = await getUser(umi); 
        const collectionMint = publicKey(assets[0].collections[0].id);
        return collectionMint;
    }
    const createProject = async (projectName: string) => {
        const userCollection = await getUserCollection();
        if (userCollection) {
            const minted = await mint(merkleTreePublic, userCollection, { name: projectName }, umi);
            console.log('Project minted: ', minted);
        }
    };
   
    const createAccount = async () => {
        const collection = await createCollection(umi);
        return collection;
    } 
    useEffect(() => {
        if (wallet.connected) {
            fetchProjects();
        }
    }, [wallet.connected, umi]);
    return (
        <>
            <div className="mx-auto max-w-6xl">
                <div className="flex justify-between">
                    <h1 className="text-3xl font-bold">Projects</h1>
                    <button className="btn btn-outline" onClick={openNewProject}>
                        <Plus />
                        New Project
                    </button>
                </div>
                <div className="grid md:grid-cols-3 gap-8 my-5">
                {userProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            name={project.content.metadata.name}
                            wallet={project.id}
                        />
                    ))}
                    
                </div>
            </div>
            <NewProjectModal createProject={createProject} />
            <InitializeAccountModal createAccount={createAccount}/> 
        </>
    );
}