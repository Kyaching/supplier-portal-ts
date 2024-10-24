import {NotificationContext} from "@/contexts/NotificationContext";
import {useContext} from "react";

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
