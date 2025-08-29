import { BlockNoteEditor } from "@blocknote/core";
import { createContext, useContext } from "react";

interface ScrapPaperContextState {
  editor: BlockNoteEditor;
  clearDoc: () => void;
}

export const ScrapPaperContext = createContext<
  ScrapPaperContextState | undefined
>(undefined);

export function useScrapPaper() {
  const context = useContext(ScrapPaperContext);

  if (context === undefined) {
    throw new Error("useScrapPaper must be used within a ScrapPaperProvider");
  }

  return context;
}
