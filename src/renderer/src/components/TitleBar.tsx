import {
  useBroadcastEvent,
  useEventListener,
  useOthers,
  useUpdateMyPresence,
} from "@liveblocks/react";
import { DotIcon, MegaphoneIcon } from "lucide-react";
import { JSX, useEffect, useRef } from "react";
import { Button } from "./shadcn-ui/button";

export default function TitleBar(): JSX.Element {
  const others = useOthers();
  const updateMyPresence = useUpdateMyPresence();
  const broadcast = useBroadcastEvent();
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
  }, []);

  useEventListener(({ event, user, connectionId }) => {
    console.log(event, user, connectionId);
  });

  const handlePayAttention = () => {
    broadcast({ type: "pay-attention" });
  };

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

  const online = others.length > 0;
  const active = others.some((other) => other.presence.status === "active");
  const cn = online
    ? active
      ? "text-green-500"
      : "text-yellow-500"
    : "text-red-500";
  return (
    <div className="drag-region items-center">
      <div>
        <DotIcon className={cn} />
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-500 hover:bg-transparent hover:text-gray-200"
        onClick={handlePayAttention}
      >
        <MegaphoneIcon />
      </Button>
    </div>
  );
}
