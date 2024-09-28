import {useGet} from "@/hooks/useApiCall";
import {UserItem} from "@/pages/Widget/UserItem";
import {UserDetail, UserLists} from "@/pages/Widget/UserLists";
import {useEffect, useState} from "react";
import {FiPlus, FiSave} from "react-icons/fi";

export const WidgetContainer = () => {
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [showInput, setShowInput] = useState(false);
  const {data} = useGet<UserDetail>("/users");

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  const handleRemoveUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleAddUser = () => {
    setShowInput(prev => !prev);
  };

  const handleRemove = () => {
    setShowInput(prev => !prev);
  };

  const handleSubmit = data => {
    console.log(data);
  };

  return (
    <main>
      <section className="flex gap-1 items-center">
        <button
          className={showInput ? "cursor-not-allowed opacity-50" : ""}
          disabled={showInput}
          onClick={handleAddUser}
        >
          <FiPlus />
        </button>
        <button type="submit" onClick={handleSubmit}>
          <FiSave />
        </button>
      </section>
      {showInput && <UserItem handleRemove={handleRemove} />}
      {users.map((user, index) => (
        <UserLists
          key={user.id}
          user={user}
          index={index}
          handleRemoveUser={handleRemoveUser}
        />
      ))}
    </main>
  );
};
