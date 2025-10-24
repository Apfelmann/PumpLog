import { Navigate, Outlet } from "react-router-dom";
import { usePumpLogSelector } from "../store/storehooks";

export const ProtectedRoute = () => {
  const session = usePumpLogSelector((state) => state.user.session);

  if (!session?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
