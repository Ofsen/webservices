import { useContext } from "react";
import { UserContext } from "@/lib/contexts/AuthContext";

export default function useAuth() {
  return useContext(UserContext);
}
