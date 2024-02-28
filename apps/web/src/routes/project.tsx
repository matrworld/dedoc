import { useEffect, useMemo, useState } from 'react';
import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { Plus, Edit, Check, Trash } from 'lucide-react';
import "@blocknote/react/style.css";
import { useProjects } from '../lib/hooks/use-projects';
import { Pages, PageTree, PageNode, Project as ProjectType } from '../lib/types';
import { update } from '@dedoc/sdk';

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
                className={`btn btn-sm w-full mb-2 h-auto pl-2 px-0 justify-between text-xs font-semibold hover-child ${props.id === selectedPage ? "btn-primary" : ""}`}
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
        <div className={!isRoot && !isTopLevel ? "border-l border-base-300 pl-10" : ""}>
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


export function DeletePageModal()  {
    const {
        deletePage,
    } = useProjects();

    return (
        <dialog id="delete_project_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Delete Page</h3>
                <p className="py-3">Are you sure you want to remove this page?</p>
                <div className="modal-action">
                <form method="dialog" className="flex w-full justify-between">
                    <button className="btn btn-outline">Cancel</button>
                    <button className="btn btn-outline text-red-900" onClick={deletePage}>Delete</button>
                </form>
                </div>
            </div>
        </dialog>
    )
}


export function Project()  {
    const [ isEditingName, setIsEditingName ] = useState(false);
    const [ markdown, setMarkdown ] = useState("");
    const [ pageNameInput, setPageNameInput ] = useState("");

    const {
        project,
        page,
        selectedPage,
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

    return (
        <>
            <div className="mx-auto grid md:grid-cols-12 gap-10">
                <div className="xl:col-span-2 md:col-span-3">
                    <div className="pb-3">
                        <div className="flex justify-between">
                            <h1 className="text-lg font-bold">{project?.name}</h1>
                            {/* <button className="btn btn-sm btn-outline">Deploy</button> */}
                        </div>
                        {/* <button
                            className="btn btn-outline btn-sm py-1 w-full justify-start"
                            onClick={openSettings}
                        >
                            <Settings2 size={16}/>
                            Settings
                        </button> */}
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

                <div className="md:col-span-9">
                    <div className="flex justify-between">
                        <div className="flex">
                            {isEditingName ? (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Page name"
                                        value={page?.name}
                                        className="input input-sm input-bordered mb-4 text-white"
                                        onInput={handleUpdateName}
                                    />
                                    <button className="btn btn-sm btn-ghost p-1 mr-[2px]" onClick={() => setIsEditingName(false)}>
                                        <Check height={16}/>
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center gap-1 mb-4">
                                    <h1 className="text-lg font-bold">{page?.name}</h1>
                                    <button className="btn btn-sm btn-ghost p-1 mr-[2px]" onClick={() => setIsEditingName(true)}>
                                        <Edit height={16}/>
                                    </button>
                                </div>
                            )}

                            <button className="btn btn-sm btn-ghost p-1 mr-[2px] text-red-900" onClick={openDeletePage}>
                                <Trash height={16}/>
                            </button>
                        </div>

                        
                        <button className="btn btn-sm btn-outline" onClick={saveProject}>Save</button>
                    </div>
                    <BlockNoteView editor={editor} />
                </div>
            </div>

            <DeletePageModal />
        </>
    );
}