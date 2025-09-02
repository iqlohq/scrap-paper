import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNoteWithLiveblocks } from "@liveblocks/react-blocknote";
import { ReactNode, useState } from "react";
import { ScrapPaperContext } from "./scrap-paper-context";

interface ScrapPaperProviderProps {
  children: ReactNode;
}

async function uploadFile(file: File) {
  const body = new FormData();
  body.append("file", file);
  const ret = await fetch("https://tmpfiles.org/api/v1/upload", {
    method: "POST",
    body: body,
  });
  return (await ret.json()).data.url.replace(
    "tmpfiles.org/",
    "tmpfiles.org/dl/"
  );
}

export function ScrapPaperProvider({ children }: ScrapPaperProviderProps) {
  const editor = useCreateBlockNoteWithLiveblocks(
    {
      uploadFile,
    },
    { mentions: true }
  ) as BlockNoteEditor;

  const clearDoc = () => {
    if (!editor) return;
    const allIds = editor.document.map((b) => b.id);
    if (allIds.length) editor.removeBlocks(allIds);
  };

  const [showLiveCursor, setShowLiveCursor] = useState(true);

  return (
    <ScrapPaperContext.Provider
      value={{ editor, clearDoc, showLiveCursor, setShowLiveCursor }}
    >
      {children}
    </ScrapPaperContext.Provider>
  );
}
