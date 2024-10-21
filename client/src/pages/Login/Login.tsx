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
import {useAuthContext} from "@/hooks/useAuth";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string(),
});

export const Login = () => {
  const {handleLogin} = useAuthContext();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const {username, password} = data;
    handleLogin(username, password);

    form.reset();
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="rounded-md w-4/12 p-4 shadow-xl shadow-[#18b192]">
        <h2 className="text-2xl font-semibold p-6 text-center uppercase">
          log in
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto space-y-6"
          >
            <FormField
              control={form.control}
              name="username"
              render={({field}) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        className="w-2/3"
                        placeholder="username"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="w-2/3"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-center">
              <Button type="submit">Login</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
