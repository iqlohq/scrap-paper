import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNoteWithLiveblocks } from "@liveblocks/react-blocknote";
import { ReactNode, useState } from "react";
import { ScrapPaperContext } from "./scrap-paper-context";

interface ScrapPaperProviderProps {
  children: ReactNode;
}

export function ScrapPaperProvider({ children }: ScrapPaperProviderProps) {
  const editor = useCreateBlockNoteWithLiveblocks(
    {},
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
