import { Plus } from "lucide-react";
import { useProjects } from "../lib/hooks/use-projects";
import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { createCollection, generateCollectionUri } from '@dedoc/sdk';
import { useUmi } from "../lib/hooks/use-umi";
import { useIrys } from "../lib/hooks/use-irys";

const openNewProject = () => {
    // @ts-expect-error
    document?.getElementById('new_project_modal')?.showModal()
}

const initializeNewAccount = () => { 
    // @ts-expect-error
    document?.getElementById('create_account_modal')?.showModal()
}

export function NewProjectModal()  {
    return (
        <dialog id="new_project_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">C Project</h3>
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
    const { projects } = useProjects();
    const wallet = useWallet();
   
    const createAccount = async () => {
        const umi = useUmi(wallet);
        const collection = await createCollection(umi, { 
            name: 'DeDoc', 
            description: 'DeDoc NFT Collection',
            image: 'https://arweave.net/iP8xMGeXpydnvuGlucOKKprOdR-jt7UYvKdLGNkGh74',
        })
        console.log(collection?.publicKey.toString());
    } 
    useEffect(() => {
       
    }, [wallet?.connected]);
    // const createAccountModal = document.getElementById('create_account_modal');
    // if (createAccountModal) {
    //     // @ts-expect-error
    //     createAccountModal?.showModal();
    // }
    return (
        <>
            <div className="mx-auto max-w-6xl">
                <div className="flex justify-between">
                    <h1 className="text-3xl font-bold">Projects</h1>
                    <button className="btn btn-outline" onClick={openNewProject}>
                        <Plus />
                        New Project
                    </button>
                    <button className="btn btn-outline" onClick={initializeNewAccount}>
                        <Plus />
                        Creating Account
                    </button>
                </div>
                <div className="grid md:grid-cols-3 gap-8 my-5">
                    {projects.map((project: any) => (
                        <ProjectCard
                            name="Project 1"
                            wallet="0x4e3f..."
                        />
                    ))}
                    
                </div>
            </div>
            <NewProjectModal />
            <InitializeAccountModal createAccount={createAccount}/> 
        </>
    );
}