import "@liveblocks/react-tiptap/styles.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-ui/styles/dark/media-query.css";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
import { JSX } from "react";
import "./assets/shadcn.css";
import { Editor } from "./components/Editor";
import { Loader } from "./components/shadcn-ui/loader";
import TitleBar from "./components/TitleBar";
import "./globals.css";
import "./styles.css";
import { ScrapPaperProvider } from "./providers/scrap-paper-provider";

// TODO: Notification - focus button, onOpen, onClose ✅
// TODO: Authentication Done. ✅
// TODO: Styling - loading, checkmark, min-size
// TODO: Hotkeys - F6 to open/close
// TODO: Startup

export default function App(): JSX.Element {
  return (
    <LiveblocksProvider publicApiKey="pk_dev_t2fgHDjp63aK6LNHVO5WxSqruZH_fRwqDvkP5Hjl_0GwThDWUUH6PcKlRfdC3B0U">
      <RoomProvider
        id="my-room"
        initialPresence={{ id: "s", status: "active" }}
      >
        <ClientSideSuspense
          fallback={
            <div className="flex h-full w-full flex-col items-center justify-center [--webkit-app-region:drag]">
              <Loader variant="dots" />
              <span className="mt-3 text-sm text-gray-200">Connecting...</span>
            </div>
          }
        >
          <ScrapPaperProvider>
            <TitleBar />
            <Editor />
          </ScrapPaperProvider>
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
