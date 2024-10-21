import {NotificationTable} from "./NotificationTable";

const inboxHeaders = [
  {label: "From", className: "font-semibold w-[100px]"},
  {label: "Subject/Body", className: "font-semibold -[500px]"},
  {label: "Date", className: "font-semibold w-[10px]"},
  {label: "Action", className: "font-semibold w-[10px]"},
];

export const InboxPage = () => {
  // const {inboxMails, handleAction} = useContext(MailContext);

  return (
    <NotificationTable
      title="Inbox"
      headers={inboxHeaders}
      // data={inboxMails}
      // onAction={handleAction}
    />
  );
};
