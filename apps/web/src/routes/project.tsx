import { useEffect, useMemo, useState } from 'react';
import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { Plus, Edit, Check, Trash, Ban, ArrowUp, ArrowDown, Settings, Settings2, Box, Copy } from 'lucide-react';
import "@blocknote/react/style.css";
import { useProjects } from '../lib/hooks/use-projects';
import { Pages, PageTree, PageNode, Project as ProjectType } from '../lib/types';

function SideNav(props: {
    pageTree: PageTree | undefined,
    path: number[]
}) {
    const path = JSON.parse(JSON.stringify(props.path));

    const isTopLevel =  path.length === 1;
    const isRoot = path.length === 0;
    const reachedMaxDepth = 3;

    const { project, selectedPage, selectPage, setProjects, projects, addPage  } = useProjects();

    function PageButton(props: {
        id: string,
        pagePath: number[],
    }) {
        return (
            <button
                className={`no-animation btn btn-sm  w-full mb-1 h-auto px-0 justify-between text-xs font-semibold hover-child pl-1 ${props.id === selectedPage ? "btn-primary" : "opacity-80 btn-ghost"}`}
                onClick={() => selectPage(props.id)}
            >
                <p className="">
                    {project?.pages.metadata[props.id]?.name}
                </p>


                {path.length < reachedMaxDepth && (
                    <span className="btn btn-sm btn-ghost p-1 hover-child" onClick={() => addPage(
                            props.pagePath,
                        )}
                    >
                        <Plus height={18}/>
                    </span>
                )}
            </button>
        )
    }

    return (
        <div className={!isRoot && !isTopLevel ? "border-l border-gray-700 pl-5" : ""}>
            {props.pageTree?.map((item, index) => {
                const nextPath = [...props.path, index];

                return (
                    <div key={nextPath.join("-")}>
                        {!isRoot && (
                            <PageButton
                                id={item.id}
                                pagePath={nextPath}
                            />
                        )}

                        <SideNav
                            pageTree={item.children}
                            path={nextPath}
                        />
                    </div>
                )
            })} 
        </div>
    )
}

const openDeletePage = () => {
    // @ts-expect-error
    document?.getElementById('delete_project_modal')?.showModal()
}

const openProjectSettingModal = () => {
    // @ts-expect-error
    document?.getElementById('project_settings_modal')?.showModal()
}

export function DeletePageModal()  {
    const {
        deletePage,
        project,
        updateProject,
        page,
    } = useProjects();

    const [ input, setInput ] = useState("");

    function handleProjectNameInput(e: React.ChangeEvent<HTMLInputElement>) {
        setInput(e.target.value);
    }

    function handleDeletePage() {
        deletePage();
        setInput("");

        // @ts-expect-error
        document?.getElementById('delete_project_modal')?.close();
    }

    return (
        <dialog id="delete_project_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Delete Page</h3>
                <p className="py-3">Continue by typing the page name <span className="font-semibold">{page?.name}</span> below.</p>
                <p></p>
                <input
                    type="text"
                    className="input input-text input-bordered w-full"
                    placeholder="Type here..."
                    onInput={handleProjectNameInput}
                />
                <div className="modal-action">
                    <form method="dialog" className="flex w-full justify-between">
                        <button className="btn btn-outline">Cancel</button>
                        <button
                            className="btn btn-outline text-red-900"
                            onClick={() => handleDeletePage()}
                            disabled={input?.toLowerCase() !== page?.name?.toLowerCase()}>Delete</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}

export function ProjectSettingsModal()  {
    const { project, updateProject } = useProjects();

    const [ didCopy, setDidCopy ] = useState(false);

    const [ isEditing, setIsEditing ] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(`${window?.location?.origin}/#/${project?.id}`);

        setDidCopy(true);

        setTimeout(() => {
            setDidCopy(false);
        }, 3000);
    }

    function handleProjectNameInput(e: React.ChangeEvent<HTMLInputElement>) {
        if(!project) return;

        updateProject(project.id, {
            ...project,
            name: e.target.value || "",
        });
    }

    return (
        <dialog id="project_settings_modal" className="modal">
            <div className="modal-box">
                <div className="flex items-center">
                    {!isEditing ? (
                        <>
                            <div className="h-2 aspect-square bg-success rounded-xl">

                            </div>
                            <h3 className="font-semibold p-1 text-lg">{project?.name}</h3>
                            <button className="btn btn-sm btn-ghost" onClick={() => setIsEditing(true)}>
                                <Edit size={16}/>
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-2 mb-1">
                            <input className="input input-text input-bordered input-sm" value={project?.name} onChange={handleProjectNameInput}/>
                            <button className="btn btn-sm btn-outline btn-success" onClick={() => setIsEditing(false)}>
                                <Check size={16}/>
                            </button>
                        </div>
                    )}
                </div>

                <div className="my-3">
                    <div className="flex items-center justify-between">
                        <p className="text-xs uppercase font-semibold">URL</p>
                        <button className="btn btn-sm btn-ghost text-xs" onClick={handleCopy}>
                            {didCopy ? (
                                <Check size={13}/>
                            ) : (
                                <Copy size={13}/>
                            )}

                            {didCopy ? (
                                "Copied"
                            ) : (
                                "Copy"
                            )}
                        </button>
                    </div>
                    <a
                        className="bg-black bg-opacity-80 p-2 rounded-lg text-xs flex break-all link"
                        target='_blank'
                        href={`${window?.location?.origin}/#/${project?.id}`}
                    >
                        {window?.location?.origin}/#/{project?.id}
                    </a>
                </div>

                <div className="mb-3">
                    <p className="text-xs uppercase font-semibold">ID</p>
                    <div className="bg-black bg-opacity-80 p-2 rounded-lg text-xs">
                        {project?.id}
                    </div>
                </div>
                
                <div className="modal-action">
                    <form method="dialog" className="flex w-full justify-between">
                        <button className="btn btn-outline">Close</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}

export function Project()  {
    const [ isEditingName, setIsEditingName ] = useState(false);
    const [ isEditingProjectName, setIsEditingProjectName ] = useState(false);
    const [ markdown, setMarkdown ] = useState("");

    const {
        project,
        page,
        selectedPage,
        moveCurrentPage,
        selectPage,
        setProjects,
        projects,
        addPage,
        updateProject,
        updatePage,
        saveProject
    } = useProjects();

    const editor: BlockNoteEditor = useBlockNote({
        onEditorContentChange: (editor) => {
            const saveBlocksAsMarkdown = async () => {
              const markdown: string =
                await editor.blocksToMarkdownLossy(editor.topLevelBlocks);

              setMarkdown(markdown);
            };
            saveBlocksAsMarkdown();
        }
    });

    useEffect(() => {
        if (!project) return;

        updateProject(project.id, {
            ...project,
            pages: {
                ...project?.pages,
                metadata: {
                    ...project?.pages.metadata,
                    [selectedPage]: {
                        ...project?.pages.metadata[selectedPage],
                        content: markdown,
                    }
                }
            }
        });
    }, [markdown]);

    useEffect(() => {    
        if(!page) return;
        
        editor
            .tryParseMarkdownToBlocks(page.content)
            .then((blocks) => {
                editor.replaceBlocks(editor.topLevelBlocks, blocks);
            })
            .catch(console.log);
    }, [selectedPage]);

    function handleUpdateName(e: React.ChangeEvent<HTMLInputElement>) {
        if(!page) return;

        updatePage(selectedPage, {
            ...page,
            name: e.target.value,
        });

    }
    
    const openSettings = () => {
        console.log("Open settings");
    }

    return (
        <>
            <div className="mx-auto grid md:grid-cols-12 gap-10">
                <div className="xl:col-span-2 md:col-span-3">
                    <div className="pb-3">
                        <div className="flex justify-between">
                            <h1 className="text-lg font-bold">{project?.name}</h1>
                            <button className="btn-sm btn-outline btn" onClick={openProjectSettingModal}>
                                <Settings2 height={18}/>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold">PAGES</p>
                        <button className="btn btn-sm btn-ghost p-1 mr-[2px]" onClick={() => addPage(
                                        [0]
                                    )}>
                            <Plus height={18}/>
                        </button>
                    </div>
                    <SideNav
                        pageTree={project?.pages.tree}
                        path={[]}
                    />
                </div>
                {project && project.pages.tree[0].children.length > 0 ? (
                    <div className="md:col-span-9 xl:col-span-10">
                        <div className="flex justify-between mb-5">
                            <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Page name"
                                            value={page?.name}
                                            className="input input-sm input-bordered text-white"
                                            onInput={handleUpdateName}
                                        />
                                <button className="btn btn-sm btn-outline p-1 mr-[2px]" onClick={() => moveCurrentPage("up")}>
                                    <ArrowUp height={16}/>
                                </button>
                                <button className="btn btn-sm btn-outline p-1 mr-[2px]" onClick={() => moveCurrentPage("down")}>
                                    <ArrowDown height={16}/>
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-2">                                
                                <button className="btn btn-sm btn-outline p-1 mr-[2px] text-red-900" onClick={openDeletePage}>
                                    <Ban height={16}/>
                                </button>
                                <button className="btn btn-sm btn-outline" onClick={saveProject}>Save</button>
                            </div>
                        </div>
                        <BlockNoteView editor={editor} />
                    </div>
                ) : (
                    <div className="md:col-span-9">
                        <div className="border w-full rounded-lg p-5 text-center">
                                <h2 className="text-2xl">No Pages</h2>
                                <p className="text-gray-500 mb-5">Uh oh! It looks like you deleted all of your pages...</p>
                                <button
                                    className="btn"
                                    onClick={() => addPage(
                                        [0]
                                    )}
                                >
                                    <Plus />
                                    Create Page
                                </button>
                        </div>
                    </div>
                )}
            </div>
            <DeletePageModal />
            <ProjectSettingsModal />
        </>
    );
}