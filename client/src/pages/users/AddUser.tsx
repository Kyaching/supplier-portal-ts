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
import {IInputItem} from "@/utilities/types";
import {usePost} from "../../hooks/useApiCall";
import {UserData} from "@/utilities/services";
import toast from "react-hot-toast";

const inputItems: IInputItem[] = [
  {id: 1, title: "Username", name: "username", type: "text"},
  {id: 2, title: "First Name", name: "first_name", type: "text"},
  {id: 3, title: "Middle Name", name: "middle_name", type: "text"},
  {id: 4, title: "Last Name", name: "last_name", type: "text"},
  {id: 5, title: "Email", name: "email", type: "email"},
  {id: 6, title: "Password", name: "password", type: "password"},
  {id: 7, title: "Confirm Password", name: "password", type: "password"},
  {id: 8, title: "Job Title", name: "job_title", type: "text"},
  {id: 9, title: "Job Title Id", name: "job_title_id", type: "number"},
  {id: 10, title: "User Type", name: "user_type", type: "text"},
  {id: 11, title: "User Type Id", name: "user_type_id", type: "number"},
];

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  first_name: z.string().min(2, {
    message: "First Name must be at least 2 characters.",
  }),
  middle_name: z.string().min(2, {
    message: "Middle Name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
  job_title: z.string().min(2, {
    message: "Job Title must be at least 2 characters.",
  }),
  job_title_id: z.string().regex(/^\d+$/, {
    message: "Job Id must be at least 2 characters.",
  }),
  user_type: z.string().min(2, {
    message: "User Type must be at least 2 characters.",
  }),
  user_type_id: z.string().regex(/^\d+$/, {
    message: "User Type Id must be at least 2 characters.",
  }),
});

export function AddUser() {
  const {post, loading, error} = usePost<UserData>("/users");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      password: "",
      job_title: "",
      job_title_id: "",
      user_type: "",
      user_type_id: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // await post(data);
    toast.promise(post(data), {
      loading: "Saving...",
      success: <b>Success</b>,
      error: <b>Error</b>,
    });

    form.reset();
  }
  if (loading) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>Something is Wrong! Please Reload</div>;
  }

  return (
    <div className="w-1/3 mx-auto my-2 px-5 pb-2 shadow-md shadow-teal-400 rounded-md">
      <h2 className="font-semibold text-xl text-center uppercase">Add User</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="w-full">
            {inputItems.map(item => (
              <div className="mt-2" key={item.id}>
                <FormField
                  control={form.control}
                  name={item.name}
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
}
