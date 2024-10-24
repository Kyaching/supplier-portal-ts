import {NotificationProvider} from "@/contexts/NotificationContext";
import {Compose} from "@/pages/Notifications/Compose";
import {Outlet} from "react-router-dom";

export const NotificationsContainer = () => {
  return (
    <NotificationProvider>
      <div className="m-4 flex gap-2">
        <div className="basis-1/6 max-h-36 border rounded-sm">
          <Compose />
        </div>
        <div className=" flex-grow">
          <Outlet />
        </div>
      </div>
    </NotificationProvider>
  );
};
