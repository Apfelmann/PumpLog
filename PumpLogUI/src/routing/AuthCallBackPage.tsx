import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { completeLogin } from "../features/loginPage/loginServices";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#242424",
    color: "rgba(255, 255, 255, 0.87)",
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
  },
  bicepContainer: {
    fontSize: "5rem",
    animation: "curl 0.8s ease-in-out infinite",
    transformOrigin: "center center",
  },
  text: {
    marginTop: "1.5rem",
    fontSize: "1.2rem",
    fontWeight: 500,
    letterSpacing: "0.05em",
  },
};
const keyframesStyle = `
  @keyframes curl {
    0%, 100% {
      transform: rotate(-10deg) scale(1);
    }
    50% {
      transform: rotate(10deg) scale(1.15);
    }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
`;

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

  return (
    <>
      <style>{keyframesStyle}</style>
      <div style={styles.container}>
        <div style={styles.bicepContainer}>💪</div>
      </div>
    </>
  );
}
