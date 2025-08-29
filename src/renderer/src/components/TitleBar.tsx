import { useOthers } from "@liveblocks/react";
import { DotIcon } from "lucide-react";
import { JSX, useEffect, useState } from "react";

export default function TitleBar(): JSX.Element {
  const others = useOthers();
  console.log(others);
  const [hasFocus, setHasFocus] = useState(true);

  useEffect(() => {
    const handleFocus = () => {
      console.log("focus");
      setHasFocus(true);
    };
    const handleBlur = () => {
      console.log("blur");
      setHasFocus(false);
    };

    window.api.onWindowFocus(handleFocus as any);
    window.api.onWindowBlur(handleBlur as any);

    return () => {
      window.api.removeWindowFocus(handleFocus as any);
      window.api.removeWindowBlur(handleBlur as any);
    };
  }, []);

  const cn = hasFocus ? "text-green-500" : "text-red-500";
  return (
    <div className="drag-region items-center">
      <div>
        <DotIcon className={cn} />
      </div>
    </div>
  );
}
