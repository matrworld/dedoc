import { useEffect, useMemo, useState } from 'react';
import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { ChevronLeft, Settings2, Grid3X3, Plus, Edit, Check } from 'lucide-react';
import "@blocknote/react/style.css";
import { Draggable } from "react-drag-reorder";

type Page =  {
    name: string;
    content: string;
    children: Pages;
}

// Pages tree
type Pages = Page[];

function SideNav(props: {
    pages: Pages,
    path: number[]
    addPage: (path: number[]) => void,
    selectPage: (path: number[]) => void,
    selectedPage: number[]
}) {
    const isTopLevel = useMemo(() => props.path.length === 1, [props.path]);

    return (
        <div className={!isTopLevel ? "border-l border-base-300 pl-10" : ""}>
                {props.pages.map((item, index) => {
                    const currentPath = [...props.path, index];
                    return (
                        <div key={currentPath.join("-")}>
                            <button
                                className={`btn btn-sm w-full mb-2 h-auto pl-2 px-0 justify-between text-xs font-semibold hover-child ${currentPath.join("-") === props.selectedPage.join("-") ? "btn-primary" : ""}`}
                                onClick={() => props.selectPage(currentPath)}
                            >
                                <p className="">
                                    {item.name}
                                </p>
                                <span className="btn btn-sm btn-ghost p-1 hover-child" onClick={() => props.addPage(currentPath)}>
                                    <Plus height={18}/>
                                </span>
                            </button>
                            <SideNav
                                pages={item.children}
                                path={currentPath}
                                addPage={props.addPage}
                                selectPage={props.selectPage}
                                selectedPage={props.selectedPage}
                            />
                        </div>
                    )
                })}
        </div>
    )
}

export function Project()  {
    const [ pages, setPages ] = useState<Pages>([
        {
            name: "root",
            content: "",
            children: [
                {
                    name: "Page 1",
                    content: "",
                    children: []
                }
            ]
        }
    ]);

    const [ selectedPage, setSelectedPage ] = useState<number[]>([0, 0]);
    const [ isEditingName, setIsEditingName ] = useState(false);
    const [ markdown, setMarkdown ] = useState("");

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
        const page = getPage(selectedPage, pages);

        page.name = page.name;
        page.content = markdown;

        console.log(page.content, "page.content")

        updateCurrentPage(page);
    }, [markdown]);

    useEffect(() => {
        const page = getPage(selectedPage, pages);
        
        editor
            .tryParseMarkdownToBlocks(page.content)
            .then((blocks) => {
                editor.replaceBlocks(editor.topLevelBlocks, blocks);
            })
            .catch(console.log);
    }, [selectedPage]);

    function handleUpdateName(e: React.ChangeEvent<HTMLInputElement>) {
        const page = getPage(selectedPage, pages);
        page.name = e.currentTarget.value;
        page.content = page.content;

        updateCurrentPage(page);
    }

    function getPage(
        path: number[],
        pages: Pages,
    ): Page {
        const [pathIdx, ...nextPath] = path;

        const current = pages[pathIdx];

        if (!nextPath.length) {
            return current;
        }

        return getPage(
            nextPath,
            current.children,
        );
    }

    const updateCurrentPage = (page: Page) => {
        const newPages = pages;

        const current = getPage(selectedPage, newPages);

        current.name = page.name;
        current.content = page.content;

        setPages(JSON.parse(JSON.stringify(newPages)));
    };

    const addPage = (path: number[]) => {
        let newPages = pages;

        const current = getPage(path, pages);

        const page: Page = {
            name: `Page ${current.children.length + 1}`,
            content: "",
            children: []
        };

        current.children.push(page);

        setPages(JSON.parse(JSON.stringify(newPages)));
    };

    const openSettings = () => {
        console.log("Open settings");
    }

    return (
        <>
            <div className="mx-auto grid md:grid-cols-12 gap-10">
                <div className="xl:col-span-2 md:col-span-3">
                    <div className="pb-7">
                        <div className="flex justify-between">
                            <h1 className="text-lg font-bold mb-5">Project 1</h1>
                            <button className="btn btn-sm btn-outline">Deploy</button>
                        </div>
                        <button
                            className="btn btn-outline btn-sm py-1 w-full justify-start"
                            onClick={openSettings}
                        >
                            <Settings2 size={16}/>
                            Settings
                        </button>
                    </div>

                    <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold">PAGES</p>
                        <button className="btn btn-sm btn-ghost p-1 mr-[2px]" onClick={() => addPage([0])}>
                            <Plus height={18}/>
                        </button>
                    </div>
                    <SideNav
                        pages={pages[0].children}
                        path={[0]}
                        addPage={addPage}
                        selectPage={(path: number[]) => setSelectedPage(path)}
                        selectedPage={selectedPage}
                    />
                </div>

                {selectedPage && (
                    <div className="md:col-span-9">
                        <div className="flex justify-between">
                            {isEditingName ? (
                                <div className="flex">
                                    <input
                                        type="text"
                                        placeholder="Page name"
                                        value={getPage(selectedPage, pages)?.name}
                                        className="input input-sm input-bordered mb-4 text-white"
                                        onInput={handleUpdateName}
                                    />
                                    <button className="btn btn-sm btn-ghost p-1 mr-[2px]" onClick={() => setIsEditingName(false)}>
                                            <Check height={16}/>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 mb-4">
                                    <h1 className="text-lg font-bold">{getPage(selectedPage, pages)?.name}</h1>
                                    <button className="btn btn-sm btn-ghost p-1 mr-[2px]" onClick={() => setIsEditingName(true)}>
                                        <Edit height={16}/>
                                    </button>
                                </div>
                            )}
                            <button className="btn btn-sm btn-outline">Save</button>
                        </div>
                        <BlockNoteView editor={editor} />
                    </div>
                )}
            </div>
        </>
    );
}