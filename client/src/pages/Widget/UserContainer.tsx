import {useDroppable} from "@dnd-kit/core";
import {UserDetail, UserLists} from "./UserLists";
import {SortableContext} from "@dnd-kit/sortable";
import {maxmimizeUser} from "@/components/WidgetContainer";

interface UserListContainerProps {
  id: string;
  handleRemoveUser: (id: string) => void;
  setWatch: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAllFilled: React.Dispatch<React.SetStateAction<boolean>>;
  maximizeId: maxmimizeUser;
  handleMaximizeUser: (id: string) => void;
  // items: UserDetail[];
  users: UserDetail[];
  setUsers: React.Dispatch<React.SetStateAction<UserDetail[]>>;
}

export const UserContainer: React.FC<UserListContainerProps> = ({
  users,
  setUsers,
  handleRemoveUser,
  id,
  setWatch,
  setIsAllFilled,
  maximizeId,
  handleMaximizeUser,
}) => {
  const {setNodeRef} = useDroppable({
    id: id,
    data: {
      accepts: ["empty"],
    },
  });
  return (
    <div ref={setNodeRef} className="bg-red-200 min-h-96">
      <SortableContext items={[...users, "root"]}>
        {users.map((user, index) => (
          <UserLists
            key={user?.id}
            user={user}
            index={index}
            handleRemoveUser={handleRemoveUser}
            setWatch={setWatch}
            setIsAllFilled={setIsAllFilled}
            maximize={maximizeId[user?.id] || false}
            handleMaximizeUser={handleMaximizeUser}
            updateUser={(updatedUser: UserDetail) => {
              setUsers(prev =>
                prev.map(u => (u.id === updatedUser.id ? updatedUser : u))
              );
            }}
          />
        ))}
      </SortableContext>
    </div>
  );
};
