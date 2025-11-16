import { Outlet } from "react-router";
import { MobileNavigationBar } from "./sideBar/MobileNavigationBar";

export const MobileMainContainer = () => {
  return (
    <div className="h-full w-full">
      <MobileNavigationBar />
      <Outlet />
    </div>
  );
};
