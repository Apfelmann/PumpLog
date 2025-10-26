import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { completeLogin } from "../features/loginPage/loginServices";
export function AuthCallbackPage() {
  const navigate = useNavigate();
  const hasHandled = useRef(false);

  useEffect(() => {
    if (hasHandled.current) {
      return;
    }
    hasHandled.current = true;

    completeLogin()
      .then(() => navigate("/app/dashboard", { replace: true }))
      .catch(() => navigate("/login", { replace: true }));
  }, [navigate]);

  return <div>Login wird abgeschlossen …</div>;
}
