import { Plus } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

import { useFetchable, handleFetchable } from "../lib/fetchable"
import { getProjects, createProject } from "../lib/api";
import { useProject } from "../lib/hooks/useProject";


const openNewProject = () => {
    // @ts-expect-error
    document?.getElementById('new_project_modal')?.showModal()
}

// function useCreateProject() {
//     const [ newProject, setNewProject ] = useFetchable();

//     handleFetchable(async () => createProject(), setNewProject);
    

//     return createProject;
// }

export function NewProjectModal()  {
    return (
        <dialog id="new_project_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">New Project</h3>
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
    const location = useLocation();

    const [ projects, setProjects ] = useFetchable();

    useEffect(() => {
        handleFetchable(getProjects, setProjects);
    }, [])

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
                    <ProjectCard
                        name="Project 1"
                        wallet="0x4e3f..."
                    />
                </div>
            </div>
            <NewProjectModal />
        </>
    );
}