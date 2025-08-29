import "@blocknote/core/fonts/inter.css";
import {
  BlockNoteView,
  darkDefaultTheme,
  type Theme,
} from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import { JSX } from "react";
import { useScrapPaper } from "../providers/scrap-paper-context";
import { Threads } from "./Threads";

const darkTheme: Theme = {
  colors: darkDefaultTheme.colors,
  fontFamily: "Menlo",
};

export function Editor(): JSX.Element {
  const { editor } = useScrapPaper();

  return (
    <div className="editor-container">
      <BlockNoteView editor={editor} className="editor" theme={darkTheme} />
      <Threads editor={editor} />
    </div>
  );
}
