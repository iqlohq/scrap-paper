import { BlockNoteEditor } from "@blocknote/core";
import { createContext, useContext } from "react";

interface ScrapPaperContextState {
  editor: BlockNoteEditor;
  showLiveCursor: boolean;
  setShowLiveCursor: (show: boolean) => void;
  clearDoc: () => void;
  toggleScreenShare: () => void;
  leaveScreenShare: () => void;
  dailyStatus: "connected" | "disconnected";
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
