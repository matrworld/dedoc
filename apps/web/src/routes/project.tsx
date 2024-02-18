import { useEffect } from 'react';
import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";

export function Project()  {

    const editor: BlockNoteEditor = useBlockNote({});

    return (
        <div className="mx-auto">
            <BlockNoteView editor={editor} />
        </div>
    );
}