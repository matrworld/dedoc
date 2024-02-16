import { Plus } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

import { useFetchable, handleFetchable } from "../lib/fetchable"
import { getProjects } from "../lib/api";

function ProjectCard() {
    return (
        <a href="/#/project/4ehC" className="min-h-[10rem]  flex flex-col justify-between bg-base-300 p-5 rounded-xl">
            <h3 className="font-semibold">
                Api Docs
            </h3>
            <div className="flex items-center gap-2 text-xs font-semibold">
                <div className="w-3 h-3 bg-green-400 rounded-full">
                </div>
                4ehC...
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
        <div className="mx-auto max-w-6xl">
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold">Projects</h1>
                <button className="btn btn-outline">
                    <Plus />
                    New Project
                </button>
            </div>
            <div className="grid md:grid-cols-3 gap-8 my-5">
                <ProjectCard />
            </div>
        </div>
    );
}