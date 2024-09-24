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
import {Department} from "@/utilities/types";
import {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {FiEdit, FiSave, FiTrash} from "react-icons/fi";

export const AllDepartments = () => {
  const [isEditRow, setIsEditRow] = useState<number | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const {data} = useGet<Department>("/departments");
  const {remove} = useDelete();
  const {update} = useUpdate();
  const tableRef = useRef<HTMLDivElement | null>(null);
  const {register, handleSubmit, setValue} = useForm<Department>();

  useEffect(() => {
    if (data) {
      setDepartments(data);
    }
  }, [data]);

  const onSubmit = async (data: Department) => {
    await update(`/departments/${data.id}`, data);
    const updatedUser: Department = {
      id: data.id,
      dept_name: data.dept_name,
    };
    const updatedUsers = departments.map(dept =>
      dept.id === data.id ? updatedUser : dept
    );
    setDepartments(updatedUsers);
    setIsEditRow(null);
  };

  const handleEdit = (
    event: React.MouseEvent<HTMLButtonElement>,
    dept: Department
  ) => {
    event.preventDefault();
    setIsEditRow(prevId => (prevId === dept.id ? null : dept.id));
    if (dept.id) {
      setValue("id", dept.id);
      setValue("dept_name", dept.dept_name);
    }
  };

  const handleRemove = async (id: number) => {
    await remove(`/departments/${id}`);
    setDepartments(departments.filter(dept => dept.id !== id));
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
      <h2 className="font-semibold text-xl text-center uppercase">
        all departments
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Department Name</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments?.map(dept => (
              <TableRow key={dept.id}>
                <TableCell className="w-36">
                  {isEditRow === dept.id ? (
                    <Input {...register("id")}></Input>
                  ) : (
                    dept.id
                  )}
                </TableCell>
                <TableCell className="w-36">
                  {isEditRow === dept.id ? (
                    <Input {...register("dept_name")}></Input>
                  ) : (
                    dept.dept_name
                  )}
                </TableCell>
                <TableCell className="w-20 text-xl">
                  {isEditRow === dept.id ? (
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
                            onClick={event => handleEdit(event, dept)}
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
                      <button className="hover:bg-red-500 hover:text-white rounded-full p-1">
                        <FiTrash />
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
                          className="bg-red-400 hover:bg-red-600"
                          onClick={() => handleRemove(dept.id)}
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
