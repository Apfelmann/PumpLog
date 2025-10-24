import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import {
  ChevronLeft,
  Dashboard,
  QueryStats,
  Settings,
  ChevronRight,
  Face,
} from "@mui/icons-material";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export const SideBarMain = () => {
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { label: "Dashboard", to: "dashboard", icon: Dashboard },
    { label: "Auswertung", to: "analytics", icon: QueryStats },
    { label: "Einstellungen", to: "settings", icon: Settings },
  ];

  const drawerWidth = 230; // expanded width in px
  const collapsedWidth = 60; // collapsed (mini) width in px

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isOpen ? drawerWidth : collapsedWidth,

        "& .MuiDrawer-paper": {
          width: isOpen ? drawerWidth : collapsedWidth,
          boxSizing: "border-box",
          overflowX: "hidden",
          transition: "width 240ms ease-in-out",
          borderRight: "none",
        },
      }}
    >
      <div className="flex h-full flex-col bg-gray-700">
        <div className="flex items-center gap-2 border-b border-slate-800/60 px-4 py-5">
          <IconButton
            className=" !text-slate-100"
            onClick={() => setIsOpen((prev) => !prev)}
            size="small"
            edge="start"
            aria-label={isOpen ? "Drawer minimieren" : "Drawer öffnen"}
          >
            {isOpen ? (
              <ChevronLeft fontSize="small" />
            ) : (
              <ChevronRight fontSize="small" />
            )}
          </IconButton>

          <div
            className={`transition-all duration-200 ${
              isOpen ? "opacity-100" : "pointer-events-none opacity-0"
            } flex flex-col items-center`}
          >
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Welcome
            </p>
            <h2 className="mt-1   text-slate-100">UsernamePlaceholder</h2>

            <Face className="!text-[100px]" />
          </div>
        </div>

        <List className="">
          {navItems.map(({ label, to, icon: Icon }) => (
            <ListItemButton
              component={NavLink}
              to={to}
              sx={{
                justifyContent: isOpen ? "flex-start" : "center",
                px: isOpen ? 2 : 1.25,
                py: 1.2,
              }}
            >
              <ListItemIcon
                sx={{
                  color: "inherit",
                  justifyContent: "center",
                  mr: isOpen ? 1.5 : 0,
                  transition: "margin 200ms ease",
                }}
              >
                <Icon fontSize="small" />
              </ListItemIcon>
              <span
                className={`whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                  isOpen ? "opacity-100" : "w-0 overflow-hidden opacity-0"
                }`}
              >
                {label}
              </span>
            </ListItemButton>
          ))}
        </List>
      </div>
    </Drawer>
  );
};
