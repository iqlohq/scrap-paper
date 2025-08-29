import { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNoteWithLiveblocks } from "@liveblocks/react-blocknote";

import { JSX } from "react";
import { Threads } from "./Threads";

export function Editor(): JSX.Element {
  const editor = useCreateBlockNoteWithLiveblocks(
    {},
    { mentions: true }
  ) as BlockNoteEditor;

  return (
    <div className="editor-container">
      <BlockNoteView editor={editor} className="editor" theme="dark" />
      <Threads editor={editor} />
    </div>
  );
}
