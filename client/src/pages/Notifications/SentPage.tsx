import {useNotificationContext} from "@/hooks/useNotification";
import {NotificationTable} from "./NotificationTable";

const sentHeaders = [
  {label: "To", className: "font-semibold w-[100px]"},
  {label: "Subject/Body", className: "font-semibold w-[500px]"},
  {label: "Date", className: "font-semibold w-[200px]"},
  {label: "Action", className: "font-semibold w-[10px]"},
];

export const SentPage = () => {
  const {sentMessage, handleRemoveMessage} = useNotificationContext();

  return (
    <NotificationTable
      title="Sent"
      headers={sentHeaders}
      data={sentMessage}
      onAction={handleRemoveMessage}
    />
  );
};
