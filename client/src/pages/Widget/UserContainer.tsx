import {useDroppable} from "@dnd-kit/core";
import {UserDetail, UserLists} from "./UserLists";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {maxmimizeUser} from "@/components/WidgetContainer";
import {EmptyItem} from "./EmptyItem";

interface UserListContainerProps {
  id: string;
  handleRemoveUser: (id: string) => void;
  setWatch: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAllFilled: React.Dispatch<React.SetStateAction<boolean>>;
  maximizeId: maxmimizeUser;
  handleMaximizeUser: (id: string) => void;
  // items: UserDetail[];
  items: UserDetail[];
  users: UserDetail[];
  setUsers: React.Dispatch<React.SetStateAction<UserDetail[]>>;
}

export const UserContainer: React.FC<UserListContainerProps> = ({
  setUsers,
  handleRemoveUser,
  id,
  items,
  setWatch,
  setIsAllFilled,
  maximizeId,
  handleMaximizeUser,
}) => {
  const {setNodeRef} = useDroppable({
    id: id,
  });
  return (
    <div className="border-2">
      <SortableContext
        id={id}
        strategy={verticalListSortingStrategy}
        items={items.map(item => item.id)}
      >
        <div ref={setNodeRef}>
          {id === "root" &&
            items.map(item => <EmptyItem key={item.id} item={item} />)}
          {id === "container" &&
            items.map((user, index) => (
              <UserLists
                key={user.id}
                item={user}
                index={index}
                handleRemoveUser={handleRemoveUser}
                setWatch={setWatch}
                setIsAllFilled={setIsAllFilled}
                maximize={maximizeId[user.id] || false}
                handleMaximizeUser={handleMaximizeUser}
                updateUser={(updatedUser: UserDetail) => {
                  setUsers(prev =>
                    prev.map(u => (u.id === updatedUser.id ? updatedUser : u))
                  );
                }}
              />
            ))}
        </div>
      </SortableContext>
    </div>
  );
};
