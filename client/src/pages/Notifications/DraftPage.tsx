import {useNotificationContext} from "@/hooks/useNotification";
import {NotificationTable} from "./NotificationTable";

const draftHeaders = [
  {label: "To", className: "font-semibold w-[100px]"},
  {label: "Subject/Body", className: "font-semibold w-[500px]"},
  {label: "Date", className: "font-semibold w-[200px]"},
  {label: "Action", className: "font-semibold w-[10px]"},
];

export const DraftPage = () => {
  const {drafts, handleRemoveMessage} = useNotificationContext();
  return (
    <NotificationTable
      title="Draft"
      headers={draftHeaders}
      data={drafts}
      onAction={handleRemoveMessage}
    />
  );
};
