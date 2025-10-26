import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthCallbackPage } from "./routing/AuthCallBackPage";
import { LogoutPage } from "./routing/LogoutPage";
import { ProtectedRoute } from "./routing/ProtectedRoute";
import { LoginPage } from "./features/loginPage/LoginPage";
import { MainContainer } from "./features/MainContainer";
import { Dashboard } from "./features/dashboard/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/auth/logout" element={<LogoutPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<MainContainer />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="analytics" element={<div>analytics</div>} />
            <Route path="settings" element={<div>settings</div>} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
