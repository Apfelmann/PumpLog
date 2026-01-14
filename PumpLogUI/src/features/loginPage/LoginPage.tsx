import { Backdrop, Button, CircularProgress } from "@mui/material";
import { useCallback, useState } from "react";
import { startLogin } from "./loginServices";

export const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOidcLogin = useCallback(() => {
    setIsLoading(true);
    void startLogin().finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      {/* Overlay das die ganze Seite dimmt während des Ladens */}
      <Backdrop
        open={isLoading}
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: 1300,
          flexDirection: "column",
          gap: 2,
        }}
      >
        <span
          style={{
            fontSize: "4rem",
            animation: "pulse 1s ease-in-out infinite",
          }}
        >
          💪
        </span>
        <CircularProgress color="inherit" />
        <span style={{ color: "white", marginTop: "0.5rem" }}>
          Verbinde mit Authentik...
        </span>
        <style>{`@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }`}</style>
      </Backdrop>

      <div className="h-screen w-screen flex items-center justify-center">
        <div className="flex flex-col gap-[15px] border border-gray-300 p-6 rounded-lg ">
          <h1>PumpLog</h1>
          <p className="text-sm text-gray-400">
            Melde dich mit deine Konto an.
          </p>
          <Button
            variant="contained"
            onClick={handleOidcLogin}
            disabled={isLoading}
          >
            {isLoading ? "Wird verbunden..." : "Mit Authentik anmelden"}
          </Button>
        </div>
      </div>
    </>
  );
};
