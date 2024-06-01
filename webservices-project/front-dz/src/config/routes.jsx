import { createBrowserRouter } from "react-router-dom";
import Profile from "@/screens/Profile";
import Home from "@/screens/Home";
import { LoginScreen } from "@/screens/Auth/Login";
import { SignUpScreen } from "@/screens/Auth/SignUp";
import { NotFound } from "@/screens/NotFound";
import { Terms } from "@/screens/Terms";
import { Privacy } from "@/screens/Privacy";
import withAuth from "@/lib/utils/withAuth";
import Plans from "../screens/Plans";

const router = createBrowserRouter([
  {
    path: "/plans",
    Component: withAuth(Plans),
  },
  {
    path: "/profile",
    Component: withAuth(Profile),
  },
  {
    path: "/auth/login",
    Component: LoginScreen,
  },
  {
    path: "/auth/signup",
    Component: SignUpScreen,
  },
  {
    path: "/terms",
    Component: Terms,
  },
  {
    path: "/privacy",
    Component: Privacy,
  },
  {
    path: "/success",
    Component: Home,
  },
  {
    path: "/",
    Component: Home,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);

export default router;
