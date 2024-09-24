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
import {useDelete, useGet, useUpdate} from "@/hooks/useApiCall";
import {FormValues, User} from "@/utilities/types";
import {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {FiEdit, FiSave, FiTrash} from "react-icons/fi";

export const AllUsers = () => {
  const [isEditRow, setIsEditRow] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const {data} = useGet("/users");
  const {remove} = useDelete();
  const {update} = useUpdate();
  const tableRef = useRef<HTMLDivElement | null>(null);
  const {register, handleSubmit, setValue} = useForm<FormValues>();

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  const onSubmit = async (data: FormValues) => {
    await update(`/users/${data.id}`, data);
    const updatedUser: User = {
      id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
      job_title: {name: data.job_title},
      job_title_id: data.job_title_id,
    };
    const updatedUsers = users.map(user =>
      user.id === data.id ? updatedUser : user
    );
    setUsers(updatedUsers);
    setIsEditRow(null);
  };

  const handleEdit = (
    event: React.MouseEvent<HTMLButtonElement>,
    user: User
  ) => {
    event.preventDefault();
    setIsEditRow(prevId => (prevId === user.id ? null : user.id));
    if (user.id) {
      setValue("id", user.id);
      setValue("first_name", user.first_name);
      setValue("last_name", user.last_name);
      setValue("job_title", user.job_title.name);
      setValue("job_title_id", user.job_title_id);
    }
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
                    <Input {...register("first_name")}></Input>
                  ) : (
                    user.first_name
                  )}
                </TableCell>
                <TableCell className="w-36">
                  {isEditRow === user.id ? (
                    <Input {...register("last_name")}></Input>
                  ) : (
                    user.last_name
                  )}
                </TableCell>
                <TableCell className="w-36">
                  {isEditRow === user.id ? (
                    <Input {...register("job_title")}></Input>
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
                            onClick={event => handleEdit(event, user)}
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
