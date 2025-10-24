import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { completeLogout } from "../features/loginPage/loginServices";

export function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    completeLogout().finally(() => navigate("/login", { replace: true }));
  }, [navigate]);

  return <div>Logout …</div>;
}
