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
import {Department, Employee, job_title} from "@/utilities/types";
import {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {FiEdit, FiSave, FiTrash} from "react-icons/fi";

export const AllEmployees = () => {
  const [isEditRow, setIsEditRow] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const {data} = useGet<Employee>("/employees");
  const {data: jobTitles} = useGet<job_title>("/job_titles");
  const {data: departments} = useGet<Department>("/departments");
  const {remove} = useDelete();
  const {update} = useUpdate();
  const tableRef = useRef<HTMLDivElement | null>(null);
  const {register, handleSubmit, setValue} = useForm<Employee>();

  useEffect(() => {
    if (data) {
      setEmployees(data);
    }
  }, [data]);

  const onSubmit = async (data: Employee) => {
    const {emp_name, first_name, last_name, email, dept_id, job_title_id} =
      data;
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
      className="w-4/5 mx-auto my-2 px-5 pb-2 shadow-md shadow-teal-400 rounded-md"
    >
      <h2 className="font-semibold text-xl text-center uppercase">
        all employees
      </h2>
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
  );
};
