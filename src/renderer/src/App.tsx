import { DailyProvider, useCallObject } from "@daily-co/daily-react";
import "@liveblocks/react-tiptap/styles.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-ui/styles/dark/media-query.css";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
import { JSX, useEffect } from "react";
import { Editor } from "./components/Editor";
import { Loader } from "./components/shadcn-ui/loader";
import TitleBar from "./components/TitleBar";
import { ScrapPaperProvider } from "./providers/scrap-paper-provider";

// TODO: Notification - focus button, onOpen, onClose ✅
// TODO: Authentication Done. ✅
// TODO: Styling - loading, checkmark, min-size
// TODO: Hotkeys - F6 to open/close
// TODO: Startup

export default function App(): JSX.Element {
  const callObject = useCallObject({
    options: {
      url: "https://scrap-paper.daily.co/iqlo-joe",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvIjp0cnVlLCJyIjoiaXFsby1qb2UiLCJ1IjoiaVFMTyIsInAiOnsiY3MiOiJzdiIsImNyIjp7ImIiOmZhbHNlfX0sImQiOiJlZTg0NDcyMy0zMjg3LTRlM2YtYmFmMC0wYTNjNzgwM2IwZjciLCJpYXQiOjE3NTY4NDM1Njl9.cHHpK6lXl1n_W7MM3HMYnfSjvkLG9Q27XDfYL63zCII",
    },
  });

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const delta = e.deltaY;
      // Negative deltaY = scroll up -> increase; positive = scroll down -> decrease
      const stepDirection = delta < 0 ? 1 : -1;
      window.api?.adjustOpacity?.(stepDirection);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

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
          <DailyProvider callObject={callObject}>
            <ScrapPaperProvider>
              <TitleBar />
              <Editor />
            </ScrapPaperProvider>
          </DailyProvider>
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
