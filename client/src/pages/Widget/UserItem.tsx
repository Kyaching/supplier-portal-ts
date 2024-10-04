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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {useGet} from "@/hooks/useApiCall";
import {job_title, user_Type} from "@/utilities/types";
import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {FiMaximize, FiTrash} from "react-icons/fi";

type UserInputFieldNames =
  | "first_name"
  | "last_name"
  | "email"
  | "username"
  | "job_title_id"
  | "user_type_id"
  | "tenant_id";

interface IUserItem {
  title?: string;
  name: UserInputFieldNames;
  type?: "text" | "select";
  category?: "job_title" | "user_type";
}

export interface IUserInput {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  job_title_id: string;
  user_type_id: string;
  tenant_id: string;
}

interface UserListProps {
  handleRemove: () => void;
  onChange: (data: IUserInput) => void;
  setWatch: React.Dispatch<React.SetStateAction<boolean>>;
}

const userInputs: IUserItem[] = [
  {title: "First Name", name: "first_name", type: "text"},
  {title: "Last Name", name: "last_name", type: "text"},
  {title: "Email", name: "email", type: "text"},
  {title: "Username", name: "username", type: "text"},
  {
    title: "Job Title",
    name: "job_title_id",
    type: "select",
    category: "job_title",
  },
  {
    title: "User Type",
    name: "user_type_id",
    type: "select",
    category: "user_type",
  },
  {title: "Tenant Id", name: "tenant_id", type: "text"},
];

export const UserItem: React.FC<UserListProps> = ({
  handleRemove,
  onChange,
  setWatch,
}) => {
  const {data: userTypes} = useGet<user_Type>("/user_types");
  const {data: jobTitles} = useGet<job_title>("/job_titles");
  const form = useForm<IUserInput>({
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      job_title_id: "",
      user_type_id: "",
      tenant_id: "1",
    },
  });

  const {dirtyFields} = form.formState;
  const totalFields = userInputs.length - 1;

  const allFieldsDirty = Object.keys(dirtyFields).length >= totalFields;

  useEffect(() => {
    setWatch(allFieldsDirty);
  }, [allFieldsDirty, setWatch]);

  const handleInputChange = () => {
    const values = form.getValues();
    onChange(values);
  };

  return (
    <main className="m-2">
      <header className="flex items-center justify-between text-base p-2 bg-[#18b192] text-white rounded-t-sm h-6 cursor-grab">
        <span>0</span>
        <div className="flex items-center gap-1">
          <button>
            <FiMaximize />
          </button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button>
                <FiTrash />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-400 hover:bg-red-600"
                  onClick={handleRemove}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>
      <Form {...form}>
        <form className="space-y-6">
          <div className="grid grid-cols-4 gap-2 bg-[#8bf1dd] p-2 rounded-b-sm">
            {userInputs.map(item => (
              <div
                key={item.name}
                className={item.name === "email" ? "col-span-2" : ""}
              >
                <FormField
                  control={form.control}
                  name={item.name}
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>{item.title}</FormLabel>
                      {item.type === "select" ? (
                        <Select
                          onValueChange={value => {
                            field.onChange(value);
                            handleInputChange();
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-6 bg-white border-white">
                              <SelectValue></SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {item.category === "job_title" &&
                              jobTitles?.map(option => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.name}
                                </SelectItem>
                              ))}

                            {item.category === "user_type" &&
                              userTypes?.map(option => (
                                <SelectItem
                                  key={option.id}
                                  value={String(option.id)}
                                >
                                  {option.type}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <FormControl>
                          <Input
                            className="h-6 bg-white border-white"
                            {...field}
                            onChange={e => {
                              field.onChange(e);
                              handleInputChange();
                            }}
                          />
                        </FormControl>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        </form>
      </Form>
    </main>
  );
};