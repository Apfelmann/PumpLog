import { Outlet } from "react-router";
import { DesktopSidePanel } from "../navigation/DesktopSidePanel";

export const DesktopMainContainer = () => {
  return (
    <div className="flex min-h-[100dvh] bg-gradient-to-b from-zinc-950 via-[#08080c] to-neutral-900 text-white">
      <DesktopSidePanel />
      {/* Offset for the fixed 256px sidebar */}
      <div className="flex-1 ml-64 min-h-[100dvh] overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};
