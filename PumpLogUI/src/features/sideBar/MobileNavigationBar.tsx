import React from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import {
  QueryStats,
  Settings,
  FitnessCenter,
} from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";

// Mobile-only fixed bottom menu bar that overlays content.
// Kept export name so existing imports keep working.
export const MobileNavigationBar: React.FC = () => {
  const location = useLocation();
  const mobileHeight = 120; // px height of the bottom bar

  const navItems = [
    {
      label: "Dashboard",
      to: "/app/dashboard",
      icon: <FitnessCenter fontSize="small" />,
    },
    {
      label: "Auswertung",
      to: "/app/analytics",
      icon: <QueryStats fontSize="small" />,
    },
    {
      label: "Einstellungen",
      to: "/app/settings",
      icon: <Settings fontSize="small" />,
    },
  ];

  const currentIndex = Math.max(
    0,
    navItems.findIndex((n) => location.pathname.startsWith(n.to))
  );

  return (
    <Paper
      elevation={8}
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: mobileHeight,
        zIndex: 1400,
      }}
      style={
        {
          ["--app-bottom-bar-h" as any]: `${mobileHeight}px`,
        } as React.CSSProperties
      }
    >
      <BottomNavigation
        value={currentIndex}
        showLabels
        sx={{ height: mobileHeight, bgcolor: "InfoBackground" }}
      >
        {navItems.map((n) => (
          <BottomNavigationAction
            key={n.to}
            component={NavLink}
            to={n.to}
            label={n.label}
            icon={n.icon}
            sx={{
              color: "white",
              "& .MuiSvgIcon-root": { color: "white" },
              "&.Mui-selected": { color: "wheat" },
              "&.Mui-selected .MuiSvgIcon-root": { color: "wheat" },
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};
