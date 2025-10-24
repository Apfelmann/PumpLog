import { Outlet } from "react-router";
import { SideBarMain } from "./sideBar/SideBarMain";

export const MainContainer = () => {
  return (
    <div className="flex">
      <SideBarMain />
      <Outlet />
    </div>
  );
};
