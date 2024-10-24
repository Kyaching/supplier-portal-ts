import {useNotificationContext} from "@/hooks/useNotification";
import {NotificationTable} from "./NotificationTable";

const inboxHeaders = [
  {label: "From", className: "font-semibold w-[100px]"},
  {label: "Subject/Body", className: "font-semibold w-[500px]"},
  {label: "Date", className: "font-semibold w-[200px]"},
  {label: "Action", className: "font-semibold w-[10px]"},
];

export const InboxPage = () => {
  const {inboxMessage, handleRemoveMessage} = useNotificationContext();

  return (
    <NotificationTable
      title="Inbox"
      headers={inboxHeaders}
      data={inboxMessage}
      onAction={handleRemoveMessage}
    />
  );
};
