import {useGet, usePost} from "@/hooks/useApiCall";
import {createContext, useEffect, useState} from "react";

interface AuthContextType {
  isLogged: boolean;
  handleLogin: (username: string, password: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<string | null>(
    localStorage.getItem("username")
  );
  const [isLogged, setIsLogged] = useState(false);
  const {data} = useGet<string>("/profile");
  const {post, status} = usePost<{username: string; password: string}>(
    "/login"
  );
  console.log(data);
  useEffect(() => {
    if ((data && status === true) || user) {
      setIsLogged(true);
      console.log(user);
      setUser(data);
    }
  }, [data, status, user]);

  const handleLogin = async (username: string, password: string) => {
    await post({username, password});

    // if (status) setIsLogged(true);
    // else setIsLogged(false);
    if (status) {
      localStorage.setItem("username", username);
    }
    console.log(status, isLogged);
  };

  return (
    <AuthContext.Provider value={{isLogged, handleLogin}}>
      {children}
    </AuthContext.Provider>
  );
};
