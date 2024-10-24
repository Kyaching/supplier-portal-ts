import {TbScanEye} from "react-icons/tb";
import {useLocation, useNavigate} from "react-router-dom";
import {AiOutlineDelete} from "react-icons/ai";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {MessageData} from "@/hooks/useMessages";
import {recv_message} from "@/contexts/AuthContext/AuthContext";
import {useAuthContext} from "@/hooks/useAuth";

type Header = {
  label: string;
  className: string;
};

interface NotificationProps {
  title: string;
  headers: Header[];
  data: MessageData[] | recv_message[];
  onAction: (id: string) => Promise<void>;
}

export const NotificationTable: React.FC<NotificationProps> = ({
  title,
  headers,
  data,
  onAction,
}) => {
  const {messageId, setMessageId} = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleShowDetails = (id: string) => {
    if (messageId) {
      setMessageId(messageId?.filter(msgId => msgId !== id));
    }
    navigate(`${currentPath}/${id}`);
  };

  return (
    <>
      <p className="text-xl font-semibold p-2">{title}</p>
      <div className="ml-3 max-h-4/5 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {headers?.map((header, index) => (
                <TableHead key={index} className={header.className}>
                  {header.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="mt-10">
            {data?.map(({id, sender, receivers, subject, body, date}) => (
              <TableRow
                key={id}
                className={messageId?.includes(id) ? "font-bold" : ""}
              >
                <TableCell>
                  {title == "Inbox" ? sender : receivers?.join("; ")}
                </TableCell>
                <TableCell>
                  <span
                    className={
                      messageId?.includes(id)
                        ? "font-bold text-md"
                        : "font-semibold"
                    }
                  >
                    {subject}:{" "}
                  </span>
                  <span>{body.slice(0, 100).concat("...")}</span>
                </TableCell>
                <TableCell className="">
                  {new Date(date).toLocaleString()}
                </TableCell>

                <TableCell>
                  <div className="flex">
                    <button
                      className="hover:bg-green-400 rounded-full p-1"
                      onClick={() => handleShowDetails(id)}
                    >
                      <TbScanEye className="w-5 h-5" />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button>
                          <AiOutlineDelete className="text-base w-6 h-6 hover:bg-red-400 rounded-full p-1"></AiOutlineDelete>
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onAction(id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
