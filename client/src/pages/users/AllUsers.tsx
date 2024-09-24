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
import {Input} from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {useDelete, useGet} from "@/hooks/useApiCall";
import {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {FiEdit, FiSave, FiTrash} from "react-icons/fi";

interface job_title {
  name: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  job_title: job_title;
}

interface FormValues {
  first_name: string;
  last_name: string;
  job_title: string;
}

export const AllUsers = () => {
  const [isEditRow, setIsEditRow] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const {data} = useGet<User[]>("/users");
  const {remove} = useDelete();
  const tableRef = useRef<HTMLDivElement | null>(null);
  const {register, handleSubmit} = useForm<FormValues>();

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  const handleEdit = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    event.preventDefault();
    setIsEditRow(prevId => (prevId === id ? null : id));
  };

  const handleRemove = async (id: string) => {
    await remove(`/users/${id}`);
    setUsers(users.filter(user => user.id !== id));
  };

  const handleInputFocus = (event: FocusEvent) => {
    if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
      setIsEditRow(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleInputFocus);
    return () => {
      document.removeEventListener("mousedown", handleInputFocus);
    };
  }, []);

  return (
    <div
      ref={tableRef}
      className="w-3/5 mx-auto my-2 px-5 pb-2 shadow-md shadow-teal-400 rounded-md"
    >
      <h2 className="font-semibold text-xl text-center uppercase">all users</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map(user => (
              <TableRow key={user.id}>
                <TableCell className="w-36">
                  {isEditRow === user.id ? (
                    <Input
                      value={user.first_name}
                      {...register("first_name")}
                    ></Input>
                  ) : (
                    user.first_name
                  )}
                </TableCell>
                <TableCell className="w-36">
                  {isEditRow === user.id ? (
                    <Input
                      value={user.last_name}
                      {...register("last_name")}
                    ></Input>
                  ) : (
                    user.last_name
                  )}
                </TableCell>
                <TableCell className="w-36">
                  {isEditRow === user.id ? (
                    <Input
                      value={user.job_title.name}
                      {...register("job_title")}
                    ></Input>
                  ) : (
                    user.job_title.name
                  )}
                </TableCell>
                <TableCell className="w-20 text-xl">
                  {isEditRow === user.id ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="submit"
                            className="mr-2 hover:bg-green-500 hover:text-white rounded-full p-1"
                          >
                            <FiSave />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-green-500">
                          <p>save</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="hover:bg-sky-500 hover:text-white rounded-full p-1"
                            onClick={event => handleEdit(event, user.id)}
                          >
                            <FiEdit />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-sky-400">
                          <p>edit</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="hover:bg-red-500 hover:text-white rounded-full p-1">
                              <FiTrash />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-red-500">
                            <p>Delete</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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
                          className="bg-red-400 hover:bg-red-600"
                          onClick={() => handleRemove(user.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </form>
    </div>
  );
};
