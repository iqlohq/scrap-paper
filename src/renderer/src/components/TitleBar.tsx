import {
  useBroadcastEvent,
  useEventListener,
  useOthers,
  useUpdateMyPresence,
} from "@liveblocks/react";
import { cn } from "@renderer/lib/utils";
import { useScrapPaper } from "@renderer/providers/scrap-paper-context";
import {
  DotIcon,
  Loader2Icon,
  MegaphoneIcon,
  ScreenShareIcon,
  ScreenShareOffIcon,
  TextCursor,
  TrashIcon,
} from "lucide-react";
import { JSX, useCallback, useEffect, useRef } from "react";
import { Button } from "./shadcn-ui/button";
import { Toggle } from "./shadcn-ui/toggle";

export default function TitleBar(): JSX.Element {
  const others = useOthers();
  const updateMyPresence = useUpdateMyPresence();
  const broadcast = useBroadcastEvent();
  const {
    clearDoc,
    showLiveCursor,
    setShowLiveCursor,
    toggleScreenShare,
    dailyStatus,
  } = useScrapPaper();
  const numOthers = useRef(0);

  useEffect(() => {
    const handleFocus = () => {
      updateMyPresence({ status: "active" });
    };
    const handleBlur = () => {
      updateMyPresence({ status: "away" });
    };

    window.api.onWindowFocus(handleFocus as any);
    window.api.onWindowBlur(handleBlur as any);

    return () => {
      window.api.removeWindowFocus(handleFocus as any);
      window.api.removeWindowBlur(handleBlur as any);
    };
  }, [updateMyPresence]);

  useEventListener(({ event }) => {
    if (event?.type === "pay-attention") {
      window.api.sendNotification("Attention Please!");
    }
  });

  const handlePayAttention = useCallback(() => {
    broadcast({ type: "pay-attention" });
  }, [broadcast]);

  const handleClear = useCallback(() => {
    clearDoc();
  }, [clearDoc]);

  useEffect(() => {
    if (others.length !== numOthers.current) {
      numOthers.current = others.length;
      if (numOthers.current > 0) {
        window.api.sendNotification("Scrap paper is active");
      } else {
        window.api.sendNotification("Scrap paper goes to idle mode");
      }
    }
  }, [others]);

  const handleScreenShare = useCallback(() => {
    toggleScreenShare();
  }, [toggleScreenShare]);

  // Hotkeys: Cmd+N (notify), Cmd+D (clear), Cmd+L (toggle live cursor)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isCmd = e.metaKey && !e.shiftKey && !e.altKey && !e.ctrlKey;
      if (!isCmd) return;
      const key = e.key.toLowerCase();
      if (key === "n") {
        e.preventDefault();
        handlePayAttention();
      } else if (key === "d") {
        e.preventDefault();
        handleClear();
      } else if (key === "l") {
        e.preventDefault();
        setShowLiveCursor(!showLiveCursor);
      } else if (key === "s") {
        e.preventDefault();
        handleScreenShare();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    showLiveCursor,
    handlePayAttention,
    handleClear,
    setShowLiveCursor,
    handleScreenShare,
  ]);

  const online = others.length > 0;
  const active = others.some((other) => other.presence.status === "active");
  const onlineStatusClass = online
    ? active
      ? "text-green-500"
      : "text-yellow-500"
    : "text-red-500";
  return (
    <div className="drag-region items-center">
      <div>
        <DotIcon className={onlineStatusClass} />
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-500 hover:bg-transparent hover:text-gray-200"
        onClick={handlePayAttention}
        title="Send Notification (Cmd+N)"
      >
        <MegaphoneIcon />
      </Button>
      <Toggle
        variant="default"
        size="sm"
        className="text-gray-500"
        title="Toggle Live Cursor (Cmd+L)"
        onPressedChange={(checked) => setShowLiveCursor(checked as boolean)}
        pressed={showLiveCursor}
      >
        <TextCursor />
      </Toggle>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "hover:bg-transparent hover:text-gray-200",
          dailyStatus === "connected" ? "text-green-600" : "text-gray-500"
        )}
        onClick={handleScreenShare}
        title="ScreenShare (Cmd+S)"
      >
        {dailyStatus === "connecting" ? (
          <Loader2Icon className="animate-spin" />
        ) : dailyStatus === "connected" ? (
          <ScreenShareOffIcon />
        ) : (
          <ScreenShareIcon />
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-500 hover:bg-transparent hover:text-gray-200"
        onClick={handleClear}
        title="Delete Content (Cmd+D)"
      >
        <TrashIcon />
      </Button>
    </div>
  );
}
