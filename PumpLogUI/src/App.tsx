import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthCallbackPage } from "./routing/AuthCallBackPage";
import { LogoutPage } from "./routing/LogoutPage";
import { ProtectedRoute } from "./routing/ProtectedRoute";
import { LoginPage } from "./features/loginPage/LoginPage";
import { MobileMainContainer } from "./features/MainContainer";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { Suspense } from "react";
import { WorkoutsHome } from "./features/workouts/pages/WorkoutsHome";

export default function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(1200));

  const mobileRoute = (
    <Route element={<ProtectedRoute />}>
      <Route path="/app" element={<MobileMainContainer />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <Suspense
              fallback={
                <div className="p-6 text-white">Workouts laden ...</div>
              }
            >
              <WorkoutsHome />
            </Suspense>
          }
        />
        <Route path="analytics" element={<div>analytics</div>} />
        <Route path="settings" element={<div>settings</div>} />
      </Route>
    </Route>
  );
  const desktopRoute = (
    <Route element={<ProtectedRoute />}>
      <Route
        path="/app"
        element={<div>not mobile under construction</div>}
      ></Route>
    </Route>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/app" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/auth/logout" element={<LogoutPage />} />
        {isMobile ? mobileRoute : desktopRoute}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
