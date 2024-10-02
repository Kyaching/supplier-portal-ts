import {useGet, usePost, useUpdate} from "@/hooks/useApiCall";
import {IUserInput, UserItem} from "@/pages/Widget/UserItem";
import {UserDetail, UserLists} from "@/pages/Widget/UserLists";
import {
  DndContext,
  DragStartEvent,
  PointerSensor,
  useDroppable,
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

export type maxmimizeUser = {
  [id: string]: boolean;
};

export const WidgetContainer = () => {
  const storedState = localStorage.getItem("maxsize");
  const currentState = storedState ? JSON.parse(storedState) : {};
  const {data, get, loading} = useGet<UserDetail>("/users");
  const {post} = usePost<IUserInput>("/users");
  const {update} = useUpdate<UserDetail | UserDetail[]>();
  const [showInput, setShowInput] = useState<boolean>(false);
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [watch, setWatch] = useState<boolean>(false);
  const [maximizeId, setMaximizeId] = useState<maxmimizeUser>(currentState);
  const [dragItem, setDragItem] = useState(false);
  const {setNodeRef} = useDroppable({
    id: "1",
    data: {
      accepts: "empty",
    },
  });
  const [newUser, setNewUser] = useState<IUserInput>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    job_title_id: "",
    user_type_id: "",
    tenant_id: "1",
  });

  useEffect(() => {
    const storedOrder = localStorage.getItem("userOrder");
    const storedUsers = storedOrder ? JSON.parse(storedOrder) : [];

    if (data) {
      const orderedUsers =
        storedUsers.length > 0
          ? storedUsers
              .map((id: string) => data.find(user => user.id === id))
              .filter(Boolean)
          : data;
      setUsers(orderedUsers);
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

  const handleRemoveUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleAddUser = () => {
    setShowInput(prev => !prev);
  };

  const handleRemove = () => {
    setShowInput(prev => !prev);
    setWatch(false);
  };
  const handleSaveUsers = async () => {
    if (showInput) {
      await post(newUser);
      get();
      setShowInput(false);
    } else {
      await update("/users", users);
    }
    console.log("Saving users:", users);

    // You can make an API call to save updated user data here
    setWatch(false);
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

    if (over && active?.data?.current?.type === "empty") {
      setShowInput(true);
    }

    if (dragItem && active.id !== over?.id) {
      setUsers(users => {
        const oldIndex = users.findIndex(user => user.id === active.id);
        const newIndex = users.findIndex(user => user.id === over?.id);
        const newUsers = arrayMove(users, oldIndex, newIndex);
        localStorage.setItem(
          "userOrder",
          JSON.stringify(newUsers.map(user => user.id))
        );
        return newUsers;
      });
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
      <div className="grid grid-cols-2 m-3 gap-2">
        <section>
          <EmptyItem id="1" />
        </section>
        <div ref={setNodeRef}>
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
          {showInput && (
            <UserItem
              handleRemove={handleRemove}
              onChange={setNewUser}
              setWatch={setWatch}
            />
          )}
          <SortableContext items={users}>
            {users.map((user, index) => (
              <UserLists
                key={user.id}
                user={user}
                index={index}
                handleRemoveUser={handleRemoveUser}
                setWatch={setWatch}
                maximize={maximizeId[user.id] || false}
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
      </div>
    </DndContext>
  );
};
