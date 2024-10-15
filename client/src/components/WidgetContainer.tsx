import {useDelete, useGet, useUpdate} from "@/hooks/useApiCall";
import {UserDetail, UserLists} from "@/pages/Widget/UserLists";
import {
  closestCenter,
  DndContext,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {arrayMove, SortableContext} from "@dnd-kit/sortable";
import {useEffect, useState} from "react";
import {FiPlus, FiSave} from "react-icons/fi";
import {DragEndEvent} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import {EmptyItem} from "@/pages/Widget/EmptyItem";
import toast from "react-hot-toast";
import {UserContainer} from "@/pages/Widget/UserContainer";
import {Item} from "@radix-ui/react-select";

export type maxmimizeUser = {
  [id: string]: boolean;
};

// interface Items {
//   root: string[];
//   container: UserDetail[];
// }

interface item {
  id: number;
  name: string;
}
export const WidgetContainer = () => {
  const storedState = localStorage.getItem("maxsize");
  const currentState = storedState ? JSON.parse(storedState) : {};
  const {data, loading, get} = useGet<UserDetail>("/users");
  const [leftItem, setLeftItem] = useState<UserDetail[]>([
    {
      id: "root",
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      job_title_id: "",
      user_type_id: "",
      tenant_id: "1",
    },
  ]);
  const {update} = useUpdate<UserDetail | UserDetail[]>();
  const {remove} = useDelete();
  const [showInput, setShowInput] = useState<boolean>(false);
  const [isAllFilled, setIsAllFilled] = useState<boolean>(false);
  const [users, setUsers] = useState<UserDetail[]>([]);

  const [watch, setWatch] = useState<boolean>(false);
  const [maximizeId, setMaximizeId] = useState<maxmimizeUser>(currentState);
  const [dragItem, setDragItem] = useState(false);
  const [hasAddedEmpty, setHasAddedEmpty] = useState(false);
  const [draggedIndex, setdraggedIndex] = useState<number | null>(null);
  const [isEmptyContainerActive, setIsEmptyContainerActive] = useState(false);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  const handleMaximizeUser = (id: string) => {
    const storedState = localStorage.getItem("maxsize");
    const currentState = storedState ? JSON.parse(storedState) : {};
    const newState = {
      ...currentState,
      [id]: !currentState[id],
    };
    setMaximizeId(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
    localStorage.setItem("maxsize", JSON.stringify(newState));
  };

  const handleRemoveUser = async (id: string) => {
    if (id === "2") {
      setShowInput(false);
      setHasAddedEmpty(false);
      return setUsers(users.filter(user => user.id !== id));
    }
    await remove(`/users/${id}`);
    setUsers(users.filter(user => user.id !== id));
    setShowInput(false);
  };

  const handleAddUser = () => {
    const tempId = "2";
    const newU = {
      id: tempId,
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      job_title_id: "",
      user_type_id: "",
      tenant_id: "1",
    };
    setUsers(prev => [newU, ...prev]);
    setMaximizeId(prev => {
      const updatedMaximizeId = {
        ...prev,
        [tempId]: false, // Initialize the maximize state for the new user
      };
      localStorage.setItem("maxsize", JSON.stringify(updatedMaximizeId)); // Save to localStorage
      return updatedMaximizeId;
    });
    setShowInput(prev => !prev);
  };

  const handleSaveUsers = async () => {
    const newUser = users.find(user => user.id === "2");
    if (newUser && !isAllFilled) {
      toast.error("Please fill out all field");
      return;
    }
    await update("/users", users);
    await get();

    console.log("Saving users:", users);

    // You can make an API call to save updated user data here
    setWatch(false);
    setShowInput(false);
  };

  const pointer = useSensor(PointerSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });
  const sensors = useSensors(pointer);
  const userItem = [restrictToVerticalAxis, restrictToWindowEdges];
  const emptyItem = [restrictToWindowEdges];

  const handleDragStart = (event: DragStartEvent) => {
    const {active} = event;
    setIsEmptyContainerActive(false);
    // if (active.id === "root" && !isEmptyContainerActive) {
    //   setIsEmptyContainerActive(true);
    // }

    setDragItem(users.some(user => user.id === active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    console.log("Active:", active);
    console.log("Over:", over?.id);

    if (!over) {
      return;
    }
    const overIndex = users.findIndex(user => user.id === over.id);
    if (active.id === "root" && !hasAddedEmpty) {
      const newUser = {
        id: "2", // Use an appropriate ID for the new user
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        job_title_id: "",
        user_type_id: "",
        tenant_id: "1",
      };

      if (overIndex === 0) {
        setUsers(prevUsers => {
          const newUsers = [newUser, ...prevUsers]; // Add above User 1
          return newUsers;
        });
      } else if (overIndex === users.length - 1) {
        // If hovering over the last user, insert below
        setUsers(prevUsers => {
          return [...prevUsers, newUser]; // Append to the end
        });
      } else {
        // Insert the new user input field based on the hovered user's index
        setUsers(prevUsers => {
          const newUsers = [...prevUsers];
          newUsers.splice(overIndex, 0, newUser); // Insert above the hovered user
          return newUsers;
        });
      }

      setShowInput(true);
      setHasAddedEmpty(true);

      return;
    }

    // if (active.id === "root") {
    //   const newUser = {
    //     id: "2", // Use an appropriate ID for the new user
    //     first_name: "",
    //     last_name: "",
    //     username: "",
    //     email: "",
    //     job_title_id: "",
    //     user_type_id: "",
    //     tenant_id: "1",
    //   };
    //   setUsers(prevUsers => {
    //     const overIndex = prevUsers.findIndex(user => user.id === over.id);

    //     if (overIndex === -1) {
    //       return [...prevUsers, newUser];
    //     } else {
    //       const newUserList = [...prevUsers];
    //       newUserList.splice(overIndex, 0, newUser);

    //       return newUserList;
    //     }
    //   });
    // }

    if (dragItem && active.id !== over?.id) {
      setUsers(users => {
        const oldIndex = users.findIndex(user => user.id === active.id);
        const newIndex = users.findIndex(user => user.id === over?.id);
        const newUsers = arrayMove(users, oldIndex, newIndex);

        const updatedUsers = newUsers.map((item, index) => ({
          ...item,
          order: index,
        }));

        return updatedUsers;
      });
      setWatch(true);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const {active, over} = event;
    const activeId = active.id;
    const overId = over?.id;

    const newUser = {
      id: "2", // Use an appropriate ID for the new user
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      job_title_id: "",
      user_type_id: "",
      tenant_id: "1",
    };
    if (!over) return;
    if (activeId === "root" && !isEmptyContainerActive && overId) {
      console.log("hi");
      const overIndex = users.findIndex(user => user.id === overId);

      if (overIndex !== -1) {
        setUsers(prevUsers => {
          return [
            ...prevUsers.slice(0, overIndex),
            newUser,
            ...prevUsers.slice(overIndex),
          ];
        });
        setIsEmptyContainerActive(true);
      }
    }
  };

  if (loading) return <div>Loading</div>;

  return (
    <DndContext
      modifiers={dragItem ? userItem : emptyItem}
      onDragStart={handleDragStart}
      // onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      sensors={sensors}
    >
      <div className="grid grid-cols-2 m-3 gap-2">
        <div className="z-10">
          <EmptyItem id="root" />
        </div>

        <div>
          <section className="flex gap-1 items-center">
            <button
              className={showInput ? "cursor-not-allowed opacity-50" : ""}
              disabled={showInput}
              onClick={handleAddUser}
            >
              <FiPlus />
            </button>
            <button
              className={watch ? "" : "opacity-50"}
              disabled={!watch}
              onClick={handleSaveUsers}
            >
              <FiSave />
            </button>
          </section>

          <UserContainer
            id="container"
            setWatch={setWatch}
            // items={items.container}
            users={users}
            setUsers={setUsers}
            setIsAllFilled={setIsAllFilled}
            maximizeId={maximizeId}
            handleRemoveUser={handleRemoveUser}
            handleMaximizeUser={handleMaximizeUser}
          />
        </div>
      </div>
    </DndContext>
  );
};
