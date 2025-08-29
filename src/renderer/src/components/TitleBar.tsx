import { useOthers, useUpdateMyPresence } from "@liveblocks/react";
import { DotIcon } from "lucide-react";
import { JSX, useEffect } from "react";

export default function TitleBar(): JSX.Element {
  const others = useOthers();
  const updateMyPresence = useUpdateMyPresence();

  console.log(others);

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
    </div>
  );
}
