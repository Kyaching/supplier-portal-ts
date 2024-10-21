import {NotificationTable} from "./NotificationTable";

const sentHeaders = [
  {label: "To", className: "font-semibold w-[100px]"},
  {label: "Subject/Body", className: "font-semibold w-[500px]"},
  {label: "Date", className: "font-semibold w-[10px]"},
  {label: "Action", className: "font-semibold w-[10px]"},
];

export const SentPage = () => {
  // const {sentMails, handleAction} = useContext(MailContext);
  // const {sentMails} = useContext(MailContext);

  return (
    <NotificationTable
      title="Sent"
      headers={sentHeaders}
      // data={sentMails}
      // onAction={handleAction}
    />
  );
};
