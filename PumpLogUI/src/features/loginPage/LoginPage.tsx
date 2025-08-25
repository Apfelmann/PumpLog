import { Button, TextField } from "@mui/material";
import { useLoginMutation } from "./loginServices";
import { useState } from "react";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data, isLoading, error }] = useLoginMutation();

  const handleSubmit = async () => {
    try {
      const result = await login({ username, password }).unwrap();
      console.log("erfolg", result);
    } catch (err) {
      console.error("Login Error: ", err);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col gap-[15px] border border-gray-300 p-6 rounded-lg ">
        <h1>PumpLog</h1>
        <TextField
          id="standard-basic"
          label="UserName"
          variant="standard"
          required
          disabled={isLoading}
          onChange={(e) => setUsername(e.target.value)}
          sx={{
            input: { color: "white" },
            label: { color: "white" },
          }}
        />
        <TextField
          id="standard-basic"
          label="Password"
          variant="standard"
          required
          disabled={isLoading}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            input: { color: "white" },
            label: { color: "white" },
          }}
        />
        <div className="flex gap-[10px]">
          <Button
            variant="outlined"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            Login
          </Button>
          <Button variant="outlined">Register</Button>
        </div>
      </div>
    </div>
  );
};
