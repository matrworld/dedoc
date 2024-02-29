import { Key, Plus } from "lucide-react";
import { useProjects } from "../lib/hooks/use-projects";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Project} from '@dedoc/sdk';
import { useUmi } from "../lib/hooks/use-umi";

const openNewProject = () => {
    // @ts-expect-error
    document?.getElementById('new_project_modal')?.showModal()
}  

function ProjectCard(props: { project: Project }) {
    return (
        <a href={`/#/project/${props.project.id}`} className="min-h-[10rem] flex flex-col justify-between bg-base-300 p-5 rounded-xl hover:opacity-50">
            <h3 className="font-semibold">
                {props.project.name}
            </h3>
            <div className="flex items-center gap-2 text-xs font-semibold">
                <div className="w-3 h-3 bg-green-400 rounded-full">
                </div>
                {props.project.id.slice(0, 6) + "..."}
            </div>
        </a>
    )
}

export function Projects()  {
    const wallet = useWallet();
    const umi = useUmi(wallet);
    const { updateProject, projects } = useProjects();

    console.log(projects);

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
                {projects.length > 0 ? projects.map((project, idx) => (
                        <ProjectCard
                            key={idx}
                            project={project}
                        />
                    )) : (
                        <div className="md:col-span-9">
                            <div className="border w-full rounded-lg p-5 text-center">
                                    <h2 className="text-2xl">No Projects</h2>
                                    <p className="text-gray-500 mb-5">Looks like you don't have any projects...</p>
                                    <button
                                        className="btn"
                                        onClick={openNewProject}
                                    >
                                        <Plus />
                                        Create Project
                                    </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}