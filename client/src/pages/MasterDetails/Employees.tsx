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
import "../../index.css";
import {Department, Employee, job_title} from "@/utilities/types";
// import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useRef, useState} from "react";
import {useForm, SubmitHandler} from "react-hook-form";
import {FiEdit, FiSave, FiTrash} from "react-icons/fi";
// import {z} from "zod";

// const FormSchema = z.object({
//   id: z.string({
//     message: "Username must be at least 2 characters.",
//   }),
//   emp_name: z.string().min(2, {
//     message: "Username must be at least 2 characters.",
//   }),
//   first_name: z.string().min(2, {
//     message: "First Name must be at least 2 characters.",
//   }),

//   last_name: z.string().min(2, {
//     message: "Last Name must be at least 2 characters.",
//   }),
//   email: z.string().email({
//     message: "Please enter a valid email address.",
//   }),

//   job_title_id: z.string().min(1, {
//     message: "Please select an option",
//   }),

//   dept_id: z.string().min(1, {
//     message: "Please select an option",
//   }),
//   departments: z.object({
//     id: z.number(),
//     dept_name: z.string(),
//   }),
//   job_title: z.object({
//     id: z.string(),
//     name: z.string(),
//   }),
// });

interface Filter {
  isChecked: number | null;
}

export const Employees = ({isChecked}: Filter) => {
  const [isEditRow, setIsEditRow] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const {data, get} = useGet<Employee>(
    isChecked ? `/employees?dept_id=${isChecked}` : "/employees"
  );
  const {data: jobTitles} = useGet<job_title>("/job_titles");
  const {data: departments} = useGet<Department>("/departments");
  const {post} = usePost("/employees");
  const {remove} = useDelete();
  const {update} = useUpdate();
  const tableRef = useRef<HTMLDivElement | null>(null);
  const [showInput, setShowInput] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,

    formState: {errors},
  } = useForm<Employee>();

  useEffect(() => {
    if (data) {
      setEmployees(data);
    }
  }, [data, get]);

  const onSubmit: SubmitHandler<Employee> = async (data: Employee) => {
    const {emp_name, first_name, last_name, email, dept_id, job_title_id} =
      data;
    if (showInput) {
      await post(data);
      reset();
      setShowInput(false);

      await get();
    } else {
      const updateEmployee = {
        emp_name,
        first_name,
        last_name,
        email,
        job_title_id,
        dept_id,
      };
      await update(`/employees/${data.id}`, updateEmployee);

      if (data) {
        const updatedUsers = employees.map(employee =>
          employee.id === data.id ? data : employee
        );
        setEmployees(updatedUsers);
      }
      console.log(data);
      setIsEditRow(null);
    }
  };

  const handleEdit = (
    event: React.MouseEvent<HTMLButtonElement>,
    employee: Employee
  ) => {
    event.preventDefault();
    setIsEditRow(prevId => (prevId === employee?.id ? null : employee.id));
    if (employee.id) {
      setValue("id", employee.id);
      setValue("emp_name", employee.emp_name);
      setValue("first_name", employee.first_name);
      setValue("last_name", employee.last_name);
      setValue("email", employee.email);
      setValue("job_title_id", employee.job_title_id);
      setValue("dept_id", employee.dept_id);
      setValue("departments", {
        id: employee.departments.id,
        dept_name: employee.departments.dept_name,
      });
      setValue("job_title", {
        id: employee.job_title.id,
        name: employee.job_title.name,
      });
    }
  };

  const handleRemove = async (id: string) => {
    await remove(`/employees/${id}`);
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const handleJobTitleChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const jobTitleId = event.target.value;
    setValue("job_title_id", jobTitleId);

    // Find the job title based on the selected id
    const selectedJobTitle = jobTitles?.find(job => job.id === jobTitleId);
    if (selectedJobTitle) {
      setValue("job_title", {
        id: selectedJobTitle.id,
        name: selectedJobTitle.name,
      });
    }
  };

  const handleDepartmentChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const deptId = event.target.value;
    setValue("dept_id", deptId);

    // Find the department based on the selected id
    const selectedDepartment = departments?.find(
      dept => String(dept.id) === deptId
    );
    if (selectedDepartment) {
      setValue("departments", {
        id: selectedDepartment.id,
        dept_name: selectedDepartment.dept_name,
      });
    }
  };

  const handleInputFocus = (event: FocusEvent) => {
    if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
      setIsEditRow(null);
      // setShowInput(false);
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
      className="w-4/5 mx-auto my-10 px-5 pb-2 shadow-md shadow-teal-400 rounded-md"
    >
      <div className=" p-4 flex items-center justify-between border-b-2 border-b-[#18B192]">
        <Button onClick={() => setShowInput(prev => !prev)}>
          Add Employee
        </Button>
        <h2 className="font-semibold text-md text-center uppercase">
          all employees
        </h2>
      </div>
      <div className="overflow-y-auto overflow-x-auto max-h-60 scroll-bar">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {showInput && (
                <TableRow>
                  <TableCell className="w-36">
                    <Input {...register("emp_name")} required></Input>
                    {errors.emp_name && (
                      <span className="text-red-500">
                        {errors.emp_name.message}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="w-36">
                    <Input {...register("first_name")} required></Input>
                    {errors.first_name && (
                      <span className="text-red-500">
                        {errors.first_name.message}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="w-36">
                    <Input {...register("last_name")} required></Input>
                    {errors.last_name && (
                      <span className="text-red-500">
                        {errors.last_name.message}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="w-36">
                    <Input {...register("email")} required></Input>
                    {errors.email && (
                      <span className="text-red-500">
                        {errors.email.message}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="w-36">
                    <select {...register("job_title_id")} required>
                      {jobTitles?.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    {errors.job_title_id && (
                      <span className="text-red-500">
                        {errors.job_title_id.message}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <select {...register("dept_id")} required>
                      {departments?.map(item => (
                        <option key={item.id} value={String(item.id)}>
                          {item.dept_name}
                        </option>
                      ))}
                    </select>
                    {errors.dept_id && (
                      <span className="text-red-500">
                        {errors.dept_id.message}
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
              {employees?.map(employee => (
                <TableRow key={employee.id}>
                  <TableCell className="w-36">
                    {isEditRow === employee.id ? (
                      <Input {...register("emp_name")}></Input>
                    ) : (
                      employee.emp_name
                    )}
                  </TableCell>
                  <TableCell className="w-36">
                    {isEditRow === employee.id ? (
                      <Input {...register("first_name")}></Input>
                    ) : (
                      employee.first_name
                    )}
                  </TableCell>
                  <TableCell className="w-36">
                    {isEditRow === employee.id ? (
                      <Input {...register("last_name")}></Input>
                    ) : (
                      employee.last_name
                    )}
                  </TableCell>
                  <TableCell className="w-36">
                    {isEditRow === employee.id ? (
                      <Input {...register("email")}></Input>
                    ) : (
                      employee.email
                    )}
                  </TableCell>
                  <TableCell className="w-36">
                    {isEditRow === employee.id ? (
                      <select
                        {...register("job_title_id", {required: true})}
                        onChange={handleJobTitleChange}
                      >
                        {jobTitles?.map(option => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      employee.job_title?.name
                    )}
                  </TableCell>
                  <TableCell className="w-36">
                    {isEditRow === employee.id ? (
                      <select
                        {...register("dept_id", {required: true})}
                        onChange={handleDepartmentChange}
                      >
                        {departments?.map(option => (
                          <option key={option.id} value={option.id}>
                            {option.dept_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      employee.departments?.dept_name
                    )}
                  </TableCell>
                  <TableCell className="w-20 text-xl">
                    {isEditRow === employee.id ? (
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
                              onClick={event => handleEdit(event, employee)}
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
                            onClick={() => handleRemove(employee.id)}
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
