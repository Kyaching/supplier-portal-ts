import {useDelete, useGet, useUpdate} from "@/hooks/useApiCall";
import {UserDetail} from "@/pages/Widget/UserLists";
import {
  closestCenter,
  DndContext,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {arrayMove} from "@dnd-kit/sortable";
import {useEffect, useState} from "react";
import {FiPlus, FiSave} from "react-icons/fi";
import {DragEndEvent} from "@dnd-kit/core";

import toast from "react-hot-toast";
import {UserContainer} from "@/pages/Widget/UserContainer";

export type maxmimizeUser = {
  [id: string]: boolean;
};

interface ItemsState {
  root: UserDetail[];
  container: UserDetail[];
}

export const WidgetContainer = () => {
  const storedState = localStorage.getItem("maxsize");
  const currentState = storedState ? JSON.parse(storedState) : {};
  const {data, loading, get} = useGet<UserDetail>("/users");

  const {update} = useUpdate<UserDetail | UserDetail[]>();
  const {remove} = useDelete();
  const [showInput, setShowInput] = useState<boolean>(false);
  const [isAllFilled, setIsAllFilled] = useState<boolean>(false);
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [items, setItems] = useState<ItemsState>({
    root: [
      {
        id: "2",
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        job_title_id: "",
        user_type_id: "",
        tenant_id: "1",
      },
    ],
    container: [],
  });
  const [watch, setWatch] = useState<boolean>(false);
  const [maximizeId, setMaximizeId] = useState<maxmimizeUser>(currentState);
  const [dragItem, setDragItem] = useState(false);
  const [hasAddedEmpty, setHasAddedEmpty] = useState(false);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  useEffect(() => {
    if (users) {
      setItems(prev => ({
        ...prev,
        container: users,
      }));
    }
  }, [users]);

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
    setHasAddedEmpty(false);
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
  // const userItem = [restrictToVerticalAxis, restrictToWindowEdges];
  // const emptyItem = [restrictToWindowEdges];

  const containerOrder = {
    root: 0,
    container: 1,
    // Add more containers here with their order if needed
  };

  function findContainer(id: string | number) {
    // Check if the id corresponds to a top-level key
    if (id in items) {
      return id;
    }

    // Check each container for an item with the given id
    return Object.keys(items).find(key =>
      items[key as keyof ItemsState].some(item => item.id === id)
    );
  }
  const handleDragStart = (event: DragStartEvent) => {
    const {active} = event;

    setDragItem(users.some(user => user.id === active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    const {id} = active;
    const overId = over?.id;

    const activeContainer = findContainer(id) as keyof ItemsState;
    let overContainer: keyof ItemsState | undefined;
    if (overId !== undefined) {
      overContainer = findContainer(overId) as keyof ItemsState;
    }

    // If the item is dropped outside any container, just return
    if (!activeContainer || !overContainer) {
      return;
    }

    // If the item is dropped in the same container, handle reordering
    if (activeContainer === overContainer) {
      const activeIndex = items[activeContainer].findIndex(
        item => item.id === id
      );
      const overIndex = items[overContainer].findIndex(
        item => item.id === overId
      );

      if (activeIndex !== overIndex) {
        setItems(items => ({
          ...items,
          [overContainer]: arrayMove(
            items[overContainer],
            activeIndex,
            overIndex
          ),
        }));
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const {active, over, delta} = event;

    const {id} = active;
    const overId = over?.id;
    console.log("active", id);
    console.log("overId", overId);
    const activeContainer = findContainer(id) as keyof ItemsState;
    let overContainer: keyof ItemsState | undefined;
    if (overId !== undefined) {
      overContainer = findContainer(overId) as keyof ItemsState;
    }

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    if (
      containerOrder[activeContainer] < containerOrder[overContainer] &&
      !hasAddedEmpty
    ) {
      setItems(prev => {
        const activeItems = prev[activeContainer];
        const overItems = prev[overContainer];

        const activeIndex = activeItems.findIndex(item => item.id === id);
        const overIndex = overItems.findIndex(item => item.id === id);

        let newIndex;
        if (overId !== undefined && overId in prev) {
          // We're at the root droppable of a container
          newIndex = overItems.length; // Move to the end of the container
        } else {
          const isBelowLastItem =
            over && overIndex === overItems.length - 1 && delta.y > 0;
          const modifier = isBelowLastItem ? 1 : 0;
          newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length;
        }

        return {
          ...prev,
          [activeContainer]: [
            ...prev[activeContainer].filter(item => item.id !== id),
            {
              id: Date.now().toString(),
              first_name: "",
              last_name: "",
              username: "",
              email: "",
              job_title_id: "",
              user_type_id: "",
              tenant_id: "1",
            },
          ],
          [overContainer]: [
            ...prev[overContainer].slice(0, newIndex),
            activeItems[activeIndex],
            ...prev[overContainer].slice(newIndex),
          ],
        };
      });
      setHasAddedEmpty(true);
    }
  };

  if (loading) return <div>Loading</div>;
  return (
    <DndContext
      collisionDetection={closestCenter}
      // modifiers={dragItem ? userItem : emptyItem}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      sensors={sensors}
    >
      <div className="grid grid-cols-2 m-3 gap-2">
        <UserContainer
          id="root"
          items={items?.root}
          setWatch={setWatch}
          users={users}
          setUsers={setUsers}
          setIsAllFilled={setIsAllFilled}
          maximizeId={maximizeId}
          handleRemoveUser={handleRemoveUser}
          handleMaximizeUser={handleMaximizeUser}
        />

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
            items={items?.container}
            setWatch={setWatch}
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
