import {AuthContext} from "@/contexts/AuthContext/AuthContext";
import {useContext} from "react";

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
