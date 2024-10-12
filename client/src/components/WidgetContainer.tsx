import {useDelete, useGet, useUpdate} from "@/hooks/useApiCall";
import {UserDetail, UserLists} from "@/pages/Widget/UserLists";
import {
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
  const [items, setItems] = useState({
    root: ["1"],
    container: users,
  });
  const [watch, setWatch] = useState<boolean>(false);
  const [maximizeId, setMaximizeId] = useState<maxmimizeUser>(currentState);
  const [dragItem, setDragItem] = useState(false);
  const [hasAddedEmpty, setHasAddedEmpty] = useState(false);

  useEffect(() => {
    if (data) {
      setUsers(data);
      setItems(prev => ({
        ...prev,
        container: data,
      }));
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

    setDragItem(users.some(user => user.id === active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    console.log("Active:", active);
    console.log("Over:", over?.id);

    if (!over) {
      return;
    }

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

      setUsers(users => {
        const updatedUsers = [...users];
        const overIndex = updatedUsers.findIndex(user => user.id === over?.id);

        if (overIndex === updatedUsers.length) {
          updatedUsers.push(newUser);

          return updatedUsers;
        } else {
          updatedUsers.splice(overIndex, 0, newUser);

          return updatedUsers;
        }
      });

      setShowInput(true);
      setHasAddedEmpty(true);

      return;
    }

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
    console.log("Active:", active);
    console.log("Over:", over);
    if (over && active.id === "root") {
      const overIndex = users.findIndex(user => user.id === over.id);
      console.log("Over Index:", overIndex);
      if (overIndex !== -1) {
        setUsers(prev => {
          console.log("Before Move:", prev);
          const newUsers = arrayMove(prev, prev.length - 1, overIndex + 1); // Move from the end
          console.log("After Move:", newUsers);
          return newUsers;
        });
      } else {
        console.warn("Invalid overIndex:", overIndex);
      }
    }
  };

  if (loading) return <div>Loading</div>;

  return (
    <DndContext
      modifiers={dragItem ? userItem : emptyItem}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      sensors={sensors}
    >
      <div className="grid grid-cols-2 m-3 gap-2">
        <SortableContext items={[...leftItem]}>
          <div className="z-10">
            <EmptyItem id="root" />
          </div>
        </SortableContext>
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
