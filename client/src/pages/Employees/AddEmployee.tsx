"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Department, IEmployeeItem, job_title} from "@/utilities/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {useGet, usePost} from "@/hooks/useApiCall";
import {EmployeeData} from "@/utilities/services";

const employeesItems: IEmployeeItem[] = [
  {title: "Employee Name", name: "emp_name", type: "text"},
  {title: "First Name", name: "first_name", type: "text"},
  {title: "Last Name", name: "last_name", type: "text"},
  {title: "Email", name: "email", type: "email"},
  {
    title: "Job Title",
    name: "job_title_id",
    type: "select",
    category: "job_title",
  },
  {
    title: "Department",
    name: "dept_id",
    type: "select",
    category: "department",
  },
];

const FormSchema = z.object({
  emp_name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  first_name: z.string().min(2, {
    message: "First Name must be at least 2 characters.",
  }),

  last_name: z.string().min(2, {
    message: "Last Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),

  job_title_id: z.string({
    required_error: "Please select a job title to display",
  }),

  dept_id: z.string({
    required_error: "Please select a department to display.",
  }),
});

export function AddEmployee() {
  const {data: jobTitles} = useGet<job_title>("/job_titles");
  const {data: departments} = useGet<Department>("/departments");
  const {post} = usePost<EmployeeData>("/employees");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      emp_name: "",
      first_name: "",
      last_name: "",
      email: "",
      job_title_id: "",
      dept_id: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await post(data);
    form.reset();
    console.log(data);
  }

  return (
    <div className="w-1/3 mx-auto my-2 px-5 pb-2 shadow-md shadow-teal-400 rounded-md">
      <h2 className="font-semibold text-xl text-center uppercase">
        Add Employee
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="w-full">
            {employeesItems.map((item, index) => (
              <div className="mt-2" key={index}>
                <FormField
                  control={form.control}
                  name={item.name}
                  render={({field}) => (
                    <FormItem>
                      <div className="flex gap-2 items-center justify-between">
                        <FormLabel>{item.title}:</FormLabel>
                        {item.type === "select" ? (
                          <div className="w-3/5">
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {item.category === "job_title" &&
                                  jobTitles?.map(option => (
                                    <SelectItem
                                      key={option.id}
                                      value={option.id}
                                    >
                                      {option.name}
                                    </SelectItem>
                                  ))}

                                {item.category === "department" &&
                                  departments?.map(option => (
                                    <SelectItem
                                      key={option.id}
                                      value={String(option.id)}
                                    >
                                      {option.dept_name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <FormControl>
                            <Input
                              className="w-3/5"
                              type={item.type}
                              placeholder={item.name}
                              {...field}
                            />
                          </FormControl>
                        )}
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button className="mt-4 uppercase" type="submit">
              add
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
