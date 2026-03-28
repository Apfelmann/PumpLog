import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { QueryStats, Settings, FitnessCenter, Logout } from "@mui/icons-material";
import { completeLogout } from "../../loginPage/loginServices";

const navItems = [
  {
    label: "Dashboard",
    to: "/app/dashboard",
    icon: <FitnessCenter />,
  },
  {
    label: "Auswertung",
    to: "/app/analytics",
    icon: <QueryStats />,
  },
  {
    label: "Einstellungen",
    to: "/app/settings",
    icon: <Settings />,
  },
];

export const DesktopSidePanel: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    completeLogout().finally(() => navigate("/login", { replace: true }));
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-64 flex flex-col bg-[#0d0d12] border-r border-white/8 z-50">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-300 flex items-center justify-center shadow-[0_0_16px_rgba(252,211,77,0.4)]">
            <FitnessCenter sx={{ fontSize: 20, color: "#000" }} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
            PumpLog
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? "bg-amber-300/10 text-amber-300 border border-amber-300/20 shadow-[0_0_12px_rgba(252,211,77,0.08)]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/8">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-500/8 transition-all"
        >
          <Logout />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
