"use client";

import {Check, ChevronsUpDown} from "lucide-react";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {useEffect, useState} from "react";
import {useGet} from "@/hooks/useApiCall";
import {UserDetail} from "../Widget/UserLists";
import {useAuthContext} from "@/hooks/useAuth";
import {FiDelete} from "react-icons/fi";

type User = {
  id: string;
  name: string;
};

interface PopOverProps {
  setValue: React.Dispatch<React.SetStateAction<string[]>>;
  value: string[];
}

export const PopOverSelect: React.FC<PopOverProps> = ({value, setValue}) => {
  const {data} = useGet<UserDetail>("/users");
  const loggedUser = useAuthContext();
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (Array.isArray(data)) {
      const filterUser = data.filter(user => user.username !== loggedUser.user);
      setUsers(filterUser.map(user => ({id: user.id, name: user.username})));
    }
  }, [data, loggedUser.user]);

  const handleSelectAll = () => {
    const allUsers = users.map(user => user.name);
    setValue(allUsers);
  };

  const handleSetValue = (val: string) => {
    if (value.includes(val)) {
      value.splice(value.indexOf(val), 1);
      setValue(value.filter(item => item !== val));
    } else {
      setValue(preValue => [...preValue, val]);
    }
  };

  const handleRemovesSelecteUser = (val: string) => {
    setValue(value.filter(item => item !== val));
  };

  return (
    <div className="flex gap-3">
      <Popover modal={false} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            aria-expanded={open}
            className="w-[150px] justify-between"
          >
            Select receipient
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[150px] p-0">
          <Command>
            <CommandInput placeholder="Select Receipient" />
            <CommandList>
              <CommandEmpty>No User found.</CommandEmpty>
              <CommandGroup>
                <CommandItem onSelect={handleSelectAll}>All</CommandItem>
                {users.map(user => (
                  <CommandItem
                    key={user.id}
                    value={user.name}
                    onSelect={() => {
                      handleSetValue(user.name);
                    }}
                  >
                    {user.name}
                    <Check
                      className={cn(
                        "ml-6 h-4 w-4",
                        value.includes(user.name) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div
        className="flex flex-wrap justify-end w-full 
         overflow-y-auto scroll-bar gap-3 max-h-14"
      >
        {value?.map((user, index) => (
          <div
            key={index}
            className="flex h-6 p-1 items-center bg-gray-300 rounded-full"
          >
            {user}
            <button
              className="ml-1"
              type="button"
              onClick={() => handleRemovesSelecteUser(user)}
            >
              <FiDelete />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
