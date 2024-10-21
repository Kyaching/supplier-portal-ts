import {useGet, usePost} from "@/hooks/useApiCall";
import {BASE_URL} from "@/utilities/services";
import axios from "axios";
import {createContext, useEffect, useState} from "react";

interface AuthContextType {
  isLogged: boolean;
  handleLogin: (username: string, password: string) => void;
  handleLogOut: () => void;
  user: string | string[] | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<string | string[] | null>(
    localStorage.getItem("username")
  );
  const [isLogged, setIsLogged] = useState(false);
  const {data} = useGet<string>("/profile");
  const {post: loginUser, status} = usePost<{
    username: string;
    password: string | null;
  }>("/login");
  const {post: logoutUser} = usePost<null>("/logout");

  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    setUser(savedUser);
  }, [status]);

  useEffect(() => {
    if (data || status === true) {
      setUser(data);
      setIsLogged(true);
      localStorage.setItem("username", data);
    }
  }, [data, status]);

  const handleLogin = async (username: string, password: string) => {
    await loginUser({username, password});
  };

  const handleLogOut = async () => {
    await logoutUser(null);
    setUser(null);
    localStorage.removeItem("username");
    setIsLogged(false);
  };

  return (
    <AuthContext.Provider value={{isLogged, handleLogin, handleLogOut, user}}>
      {children}
    </AuthContext.Provider>
  );
};
