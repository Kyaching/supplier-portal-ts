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
import {useSortable} from "@dnd-kit/sortable";

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

export interface UserDetail {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  job_title_id: string; // Adjusted for clarity
  user_type_id: string; // Adjusted for clarity
  tenant_id: string;
}

interface UserListProps {
  user: UserDetail;
  index: number;
  handleRemoveUser: (id: string) => void;
  updateUser: (updatedUser: UserDetail) => void;
  setWatch: React.Dispatch<React.SetStateAction<boolean>>;
  maximize: boolean;
  handleMaximizeUser: (id: string) => void;
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

export const UserLists: React.FC<UserListProps> = ({
  user,
  index,
  handleRemoveUser,
  updateUser,
  setWatch,
  maximize,
  handleMaximizeUser,
}) => {
  const {data: userTypes} = useGet<user_Type>("/user_types");
  const {data: jobTitles} = useGet<job_title>("/job_titles");
  const {attributes, listeners, setNodeRef, transition, transform, isDragging} =
    useSortable({id: user.id});

  const form = useForm<UserDetail>({
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      job_title_id: user.job_title_id,
      user_type_id: user.user_type_id,
      tenant_id: "1",
    },
  });
  const {isDirty} = form.formState;
  useEffect(() => {
    setWatch(isDirty);
  }, [isDirty, setWatch]);

  const handleChange = (fieldName: keyof UserDetail) => (value: unknown) => {
    updateUser({...user, [fieldName]: value});
  };

  const handleToggleMaximize = (id: string) => {
    handleMaximizeUser(id);
  };

  const style = {
    transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px,0)`,
    transition,
    opacity: isDragging ? "0.6" : undefined,
  };

  return (
    <main
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="m-2"
    >
      <header className="flex items-center justify-between text-base p-2 bg-[#18b192] text-white rounded-t-sm h-6 cursor-grab">
        <span>{index}</span>
        <div className="flex items-center gap-1">
          <button onClick={() => handleToggleMaximize(user.id)}>
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
                  onClick={() => handleRemoveUser(user.id)}
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
            {userInputs.slice(0, 3).map(item => (
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
                      <Input
                        className="h-6 bg-white border-white"
                        {...field}
                        onChange={e => {
                          field.onChange(e.target.value);
                          handleChange(item.name)(e.target.value);
                        }}
                      />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            {maximize &&
              userInputs.slice(3).map(item => (
                <FormField
                  key={item.name}
                  control={form.control}
                  name={item.name}
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>{item.title}</FormLabel>
                      {item.type === "select" ? (
                        <Select
                          onValueChange={value => {
                            field.onChange(value);
                            handleChange(item.name)(value);
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
                              field.onChange(e.target.value);
                              handleChange(item.name)(e.target.value);
                            }}
                          />
                        </FormControl>
                      )}
                    </FormItem>
                  )}
                />
              ))}
          </div>
        </form>
      </Form>
    </main>
  );
};
