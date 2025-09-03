import { BlockNoteEditor } from "@blocknote/core";
import { useDaily } from "@daily-co/daily-react";
import { useBroadcastEvent } from "@liveblocks/react";
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
  const broadcast = useBroadcastEvent();
  const callObject = useDaily();
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [dailyStatus, setDailyStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("disconnected");

  const clearDoc = () => {
    if (!editor) return;
    const allIds = editor.document.map((b) => b.id);
    if (allIds.length) editor.removeBlocks(allIds);
  };

  const leaveScreenShare = async () => {
    if (mediaStream) mediaStream.getTracks().forEach((track) => track.stop());
    setMediaStream(null);
    await callObject?.stopScreenShare();
    await callObject?.leave();
    setDailyStatus("disconnected");
    window.api.sendNotification("You stopped sharing your screen.");
  };

  const insertScreenShareBlock = () => {
    editor.focus();
    editor.insertBlocks(
      [
        {
          type: "heading",
          props: { level: 3, textColor: "#61AFEF" },
          content: [
            {
              type: "link",
              content:
                "🎥 Screen Shared - https://scrap-paper.daily.co/iqlo-joe",
              href: "https://scrap-paper.daily.co/iqlo-joe",
            },
          ],
        },
      ],
      editor.document[0],
      "before"
    );
  };

  const toggleScreenShare = async () => {
    if (dailyStatus === "connecting") return;
    try {
      if (dailyStatus === "connected") {
        leaveScreenShare();
        return;
      }
      setDailyStatus("connecting");
      insertScreenShareBlock();
      await callObject
        ?.join()
        .then(() => {})
        .catch((e) => {
          console.error("Failed to join", e);
          leaveScreenShare();
          return;
        });
      const screenshareStream = await navigator.mediaDevices.getDisplayMedia();
      setMediaStream(screenshareStream);
      callObject?.startScreenShare({ mediaStream: screenshareStream });
      setDailyStatus("connected");
      window.api.sendNotification("You're sharing your screen.");
      broadcast({ type: "pay-attention" });
      screenshareStream.addEventListener("inactive", () => {
        leaveScreenShare();
      });
    } catch (e) {
      console.error("Failed to get display media", e);
      leaveScreenShare();
    }
  };

  const [showLiveCursor, setShowLiveCursor] = useState(true);

  return (
    <ScrapPaperContext.Provider
      value={{
        editor,
        clearDoc,
        showLiveCursor,
        setShowLiveCursor,
        toggleScreenShare,
        leaveScreenShare,
        dailyStatus,
      }}
    >
      {children}
    </ScrapPaperContext.Provider>
  );
}
