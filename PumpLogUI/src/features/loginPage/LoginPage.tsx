import { Button, CircularProgress } from "@mui/material";
import { useCallback, useState } from "react";
import { startLogin } from "./loginServices";

export const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOidcLogin = useCallback(() => {
    setIsLoading(true);
    void startLogin().finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col gap-[15px] border border-gray-300 p-6 rounded-lg ">
        <h1>PumpLog</h1>
        <p className="text-sm text-gray-400">Melde dich mit deine Konto an.</p>
        <Button
          variant="contained"
          onClick={handleOidcLogin}
          disabled={isLoading}
          endIcon={isLoading ? <CircularProgress size={16} /> : undefined}
        >
          Mit Authentik anmelden
        </Button>
      </div>
    </div>
  );
};
