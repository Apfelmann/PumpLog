import { createBrowserRouter } from "react-router";
import { LoginPage } from "../features/loginPage/LoginPage";

export const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
]);
