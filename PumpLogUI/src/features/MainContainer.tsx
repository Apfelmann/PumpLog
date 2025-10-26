import { Outlet } from "react-router";
import { SideBarMain } from "./sideBar/SideBarMain";

export const MainContainer = () => {
  return (
    <div className="w-screen h-screen">
      <SideBarMain />
      <Outlet />
    </div>
  );
};
