import { useEffect } from 'react';
import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { ChevronLeft, Settings2, Grid3X3 } from 'lucide-react';
import "@blocknote/react/style.css";

const pages = {
    123: {
        name: "Page 123",
        content: "This is the content of page 1"
    },
    333: {
        name: "Page 333",
        content: "This is the content of page 1"
    },
    55555: {
        name: "Page 55555",
        content: "This is the content of page 1"
    },
    6666: {
        name: "Page 6666",
        content: "This is the content of page 1"
    },
    888: {
        name: "Page 888",
        content: "This is the content of page 1"
    },
    7777: {
        name: "Page 7777",
        content: "This is the content of page 1"
    },
    77: {
        name: "Page 888",
        content: "This is the content of page 1"
    },
    999: {
        name: "Page 999",
        content: "This is the content of page 1"
    },
    11: {
        name: "Page 11",
        content: "This is the content of page 1"
    },
    1111: {
        name: "Page 1111",
        content: "This is the content of page 1"
    },
}

type PageId = keyof typeof pages;

type Tree = {
    value: PageId;
    children: Tree[];
}

const config: Tree  = {
    value: 123,
    children: [
        {
            value: 333,
            children: [
                {
                    value: 55555,
                    children: [
                        {
                            value: 77,
                            children: []
                        },
                        {
                            value: 999,
                            children: []
                        },
                        {
                            value: 11,
                            children: []
                        },
                        {
                            value: 1111,
                            children: []
                        }
                    ]
                },
                {
                    value: 6666,
                    children: []
                }
            ]
        },
        {
            value: 888,
            children: [
                {
                    value: 7777,
                    children: []
                }
            ]
        },
    ]
};  

function SideNav(props: { tree: Tree, depth?: number}) {
    return (
        <div className={`${props.depth ? "border-l border-base-300 pl-10" : ""}`}>
            {props.tree.children.map((item, index) => {
                return (
                    <div key={index}>
                        <button className="btn btn-sm w-full mb-2 h-auto py-3 justify-start">{pages[item?.value]?.name}</button>
                        <SideNav tree={item} depth={props?.depth ? props?.depth + 1 : 1} />
                    </div>
                )
            })}
        </div>
    );
}

export function Project()  {
    const editor: BlockNoteEditor = useBlockNote({});

    async function save() {
        console.log(await editor?.blocksToMarkdownLossy());
    }

    const openSettings = () => {
        console.log("Open settings");
    }

    return (
        <>
            
            <div className="mx-auto grid md:grid-cols-12 gap-10">
                <div className="xl:col-span-2 md:col-span-3">
                    <div className="border-b mb-7 pb-7">
                        <div className="flex justify-between">
                            <h1 className="text-lg font-bold mb-5">Project 1</h1>
                            <button className="btn btn-sm btn-outline">Deploy</button>
                        </div>
                        <button
                            className="btn btn-outline w-full justify-start"
                            onClick={openSettings}
                        >
                            <Settings2 />
                            Settings
                        </button>
                    </div>

                    <p className="text-xs font-semibold mb-1">PAGES</p>
                    <SideNav tree={config} />
                </div>
                <div className="md:col-span-9">
                    <div className="flex justify-between border-b mb-5">
                        <h1 className="text-lg font-bold mb-5">Page 1</h1>
                        <button className="btn btn-sm btn-outline">Save</button>
                    </div>

                    <p className="text-xs mb-1">Name</p>
                    <input
                        type="text"
                        placeholder="Page name"
                        className="input input-bordered w-full mb-3"
                    />

                    <p className="text-xs mb-1">Content</p>
                    <BlockNoteView editor={editor} />
                </div>
            </div>
        </>
    );
}