import {useDelete, useGet, useUpdate} from "@/hooks/useApiCall";
import {UserDetail, UserLists} from "@/pages/Widget/UserLists";
import {
  DndContext,
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

export type maxmimizeUser = {
  [id: string]: boolean;
};

export const WidgetContainer = () => {
  const storedState = localStorage.getItem("maxsize");
  const currentState = storedState ? JSON.parse(storedState) : {};
  const {data, loading, get} = useGet<UserDetail>("/users");

  const {update} = useUpdate<UserDetail | UserDetail[]>();
  const {remove} = useDelete();
  const [showInput, setShowInput] = useState<boolean>(false);
  const [isAllFilled, setIsAllFilled] = useState<boolean>(false);
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [watch, setWatch] = useState<boolean>(false);
  const [maximizeId, setMaximizeId] = useState<maxmimizeUser>(currentState);
  const [dragItem, setDragItem] = useState(false);

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
    if (over) {
      if (active.id === "empty") {
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
          const overIndex = updatedUsers.findIndex(user => user.id === over.id);

          if (overIndex === updatedUsers.length) {
            updatedUsers.push(newUser); // Add new user to the end
            return updatedUsers;
          } else {
            updatedUsers.splice(overIndex, 0, newUser); // Insert the new user at the position of the hovered user
            return updatedUsers;
          }
        });

        setShowInput(true);

        return; // Exit early
      }
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

  if (loading) return <div>Loading</div>;

  return (
    <DndContext
      modifiers={dragItem ? userItem : emptyItem}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <SortableContext items={[...users.map(user => user.id), "empty"]}>
        <div className="grid grid-cols-2 m-3 gap-2">
          <div className="z-10">
            <EmptyItem id="empty" />
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

            {users.map((user, index) => (
              <UserLists
                key={user.id}
                user={user}
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
        </div>
      </SortableContext>
    </DndContext>
  );
};
