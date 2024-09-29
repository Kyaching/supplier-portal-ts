import {useGet, usePost} from "@/hooks/useApiCall";
import {IUserInput, UserItem} from "@/pages/Widget/UserItem";
import {UserDetail, UserLists} from "@/pages/Widget/UserLists";
import {useEffect, useState} from "react";
import {FiPlus, FiSave} from "react-icons/fi";

export const WidgetContainer = () => {
  const {data, get, loading} = useGet<UserDetail>("/users");
  const {post} = usePost<IUserInput>("/users");
  const [showInput, setShowInput] = useState(false);
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [watch, setWatch] = useState(false);
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
  const handleSaveUsers = async () => {
    if (showInput) {
      await post(newUser);
      get();
      setShowInput(false);
    }
    console.log("Saving users:", users);

    // You can make an API call to save updated user data here
  };

  if (loading) return <div>Loading</div>;

  return (
    <main>
      <>
        <section className="flex gap-1 items-center">
          <button
            className={showInput ? "cursor-not-allowed opacity-50" : ""}
            disabled={showInput}
            onClick={handleAddUser}
          >
            <FiPlus />
          </button>
          <button
            className={!watch ? "cursor-not-allowed opacity-50" : ""}
            disabled={watch}
            onClick={handleSaveUsers}
          >
            <FiSave />
          </button>
        </section>
        {showInput && (
          <UserItem handleRemove={handleRemove} onChange={setNewUser} />
        )}
        {users.map((user, index) => (
          <UserLists
            key={user.id}
            user={user}
            index={index}
            handleRemoveUser={handleRemoveUser}
            setWatch={setWatch}
            updateUser={(updatedUser: UserDetail) => {
              setUsers(prev =>
                prev.map(u => (u.id === updatedUser.id ? updatedUser : u))
              );
            }}
          />
        ))}
      </>
    </main>
  );
};
