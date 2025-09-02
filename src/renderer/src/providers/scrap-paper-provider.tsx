import { BlockNoteEditor } from "@blocknote/core";
import { useDaily } from "@daily-co/daily-react";
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
  const callObject = useDaily();
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [dailyStatus, setDailyStatus] = useState<"connected" | "disconnected">(
    "disconnected"
  );

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
  };

  const toggleScreenShare = async () => {
    try {
      if (dailyStatus === "connected") {
        leaveScreenShare();
        return;
      }
      await callObject
        ?.join()
        .then(() => {
          setDailyStatus("connected");
          editor.forEachBlock((block) => {
            console.log(block);
            return true;
          });
          editor.insertBlocks(
            [
              {
                type: "heading",
                props: { level: 2, textColor: "#61AFEF" },
                content: [
                  {
                    type: "link",
                    content: "🎥 Screen Shared - Click here",
                    href: "https://scrap-paper.daily.co/iqlo-joe",
                  },
                ],
              },
            ],
            editor.document[0],
            "before"
          );
        })
        .catch((e) => {
          setDailyStatus("disconnected");
          console.error("Failed to join", e);
          return;
        });
      const screenshareStream = await navigator.mediaDevices.getDisplayMedia();
      setMediaStream(screenshareStream);
      callObject?.startScreenShare({ mediaStream: screenshareStream });
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
