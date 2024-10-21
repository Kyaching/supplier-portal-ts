import {FiTrash} from "react-icons/fi";
import PropTypes from "prop-types";
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

type Header = {
  label: string;
  className: string;
};

interface NotificationProps {
  title: string;
  headers: Header[];
}

export const NotificationTable: React.FC<NotificationProps> = ({
  title,
  headers,
}) => {
  // const {unreadNotifications, markMessageAsViewed} = useAuth();
  // const location = useLocation();
  // const navigate = useNavigate();
  // const currentPath = location.pathname;
  // const handleDetails = id => {
  //   navigate(`${currentPath}/${id}`);
  //   markMessageAsViewed(id);
  // };

  return (
    <>
      <p className="text-xl font-semibold p-2">{title}</p>
      <div className="ml-3">
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
          {/* <TableBody>
            {data?.map(({id, sender, receivers, subject, body, date}) => (
              <TableRow
                key={id}
                className={unreadNotifications.has(id) ? "bg-gray-200" : ""}
              >
                <TableCell
                  className={
                    unreadNotifications.has(id) ? "font-bold" : "font-normal"
                  }
                >
                  {title == "Inbox" ? sender : receivers}
                </TableCell>
                <TableCell
                  className={
                    unreadNotifications.has(id) ? "font-bold" : "font-normal"
                  }
                >
                  <span className="font-semibold text-md">{subject}: </span>
                  <span className="truncate">{body}</span>
                </TableCell>
                <TableCell
                  className={
                    unreadNotifications.has(id) ? "font-bold" : "font-normal"
                  }
                >
                  {date}
                </TableCell>

                <TableCell>
                  <div className="flex">
                    <button
                      className="hover:bg-green-400 rounded-full p-1"
                      onClick={() => handleDetails(id)}
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
          </TableBody> */}
        </Table>
      </div>
    </>
  );
};
