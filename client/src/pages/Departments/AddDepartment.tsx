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
import {IDepartmentItem} from "@/utilities/types";

const departmentItems: IDepartmentItem[] = [
  {title: "Department ID", name: "dept_id", type: "number"},
  {title: "Department Name", name: "dept_name", type: "text"},
];

const FormSchema = z.object({
  dept_id: z.string().regex(/^\d+$/, {
    message: "Dept Id must be a Number",
  }),
  dept_name: z.string().min(2, {
    message: "Department Name must be at least 2 characters.",
  }),
});

export const AddDepartment = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dept_id: "",
      dept_name: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }
  return (
    <div className="w-1/3 mx-auto my-2 px-5 pb-2 shadow-md shadow-teal-400 rounded-md">
      <h2 className="font-semibold text-xl text-center uppercase mb-6">
        Add department
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="w-full">
            {departmentItems.map((item, index) => (
              <div className="mt-2">
                <FormField
                  control={form.control}
                  name={item.name}
                  key={index}
                  render={({field}) => (
                    <FormItem>
                      <div className="flex gap-2 items-center justify-between">
                        <FormLabel>{item.title}:</FormLabel>
                        <FormControl>
                          <Input
                            className="w-3/5"
                            type={item.type}
                            placeholder={item.name}
                            {...field}
                          />
                        </FormControl>
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
};
