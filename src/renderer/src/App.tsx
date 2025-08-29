import "@liveblocks/react-tiptap/styles.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-ui/styles/dark/media-query.css";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
import { JSX } from "react";
import { Editor } from "./components/Editor";
import TitleBar from "./components/TitleBar";
import "./globals.css";
import "./styles.css";

// TODO: Notification
// TODO: Authentication
// TODO: Styling

export default function App(): JSX.Element {
  return (
    <LiveblocksProvider publicApiKey="pk_dev_t2fgHDjp63aK6LNHVO5WxSqruZH_fRwqDvkP5Hjl_0GwThDWUUH6PcKlRfdC3B0U">
      <RoomProvider
        id="my-room"
        initialPresence={{ id: "iqlo", status: "active" }}
      >
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          <TitleBar />
          <Editor />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
