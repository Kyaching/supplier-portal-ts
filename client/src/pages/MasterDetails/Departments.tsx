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
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
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
import {useDelete, useGet, usePost, useUpdate} from "@/hooks/useApiCall";
import {Department} from "@/utilities/types";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {FiEdit, FiSave, FiTrash} from "react-icons/fi";
import {z} from "zod";

const FormSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, {
      message: "Dept Id must be a Number",
    })
    .min(3, {
      message: "Id must be at least 3 characters",
    }),
  dept_name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

export const Departments = () => {
  const [isEditRow, setIsEditRow] = useState<number | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const {data} = useGet<Department>("/departments");
  const {remove} = useDelete();
  const {post} = usePost<Department>("/departments");
  const {update} = useUpdate<Department>();
  const tableRef = useRef<HTMLDivElement | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: {errors},
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: "",
      dept_name: "",
    },
  });
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    if (data) {
      setDepartments(data);
    }
  }, [data]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const {id, dept_name} = data;
    const numId = parseInt(id);
    if (showInput) {
      await post({id: numId, dept_name});
      reset();
      setShowInput(false);
      setDepartments(prev => [...prev, {id: numId, dept_name}]);
    } else {
      await update(`/departments/${data.id}`, {id: parseInt(id), dept_name});
      const updatedUser: Department = {
        id: numId,
        dept_name: dept_name,
      };
      const updatedUsers = departments.map(dept =>
        dept.id === numId ? updatedUser : dept
      );
      setDepartments(updatedUsers);
      setIsEditRow(null);
    }
  };

  const handleEdit = (
    event: React.MouseEvent<HTMLButtonElement>,
    dept: Department
  ) => {
    event.preventDefault();
    setIsEditRow(prevId => (prevId === dept.id ? null : dept.id));
    if (dept.id) {
      setValue("id", String(dept.id));
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
      setShowInput(false);
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
      className="w-4/5 mt-2 mx-auto max-h-80 shadow-md shadow-teal-400 rounded-md"
    >
      <div className=" p-4 flex items-center justify-between border-b-2 border-b-[#18B192]">
        <Button onClick={() => setShowInput(prev => !prev)}>
          Add Department
        </Button>
        <h2 className="font-semibold text-md text-center uppercase">
          all departments
        </h2>
      </div>
      <div className="overflow-y-auto max-h-60 html">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Check</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Department Name</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {showInput && (
                <TableRow>
                  <TableCell className="w-10">
                    <Checkbox></Checkbox>
                  </TableCell>
                  <TableCell className="w-36">
                    <Input {...register("id")}></Input>
                    {errors.id && (
                      <span className="text-red-500">{errors.id.message}</span>
                    )}
                  </TableCell>
                  <TableCell className="w-36">
                    <Input {...register("dept_name")}></Input>
                    {errors.dept_name && (
                      <span className="text-red-500">
                        {errors.dept_name.message}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="w-20 text-xl">
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
                            onClick={() => setShowInput(prev => !prev)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              )}
              {departments?.map(dept => (
                <TableRow key={dept.id}>
                  <TableCell className="w-10">
                    <Checkbox></Checkbox>
                  </TableCell>
                  <TableCell className="w-36">
                    {isEditRow === dept.id ? (
                      <Input {...register("id")}></Input>
                    ) : (
                      dept.id
                    )}
                    {isEditRow === dept.id && errors.id && (
                      <span className="text-red-500">{errors.id.message}</span>
                    )}
                  </TableCell>
                  <TableCell className="w-36">
                    {isEditRow === dept.id ? (
                      <Input {...register("dept_name")}></Input>
                    ) : (
                      dept.dept_name
                    )}
                    {isEditRow === dept.id && errors.dept_name && (
                      <span className="text-red-500">
                        {errors.dept_name.message}
                      </span>
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
    </div>
  );
};
