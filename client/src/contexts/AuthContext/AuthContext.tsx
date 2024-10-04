import {usePost} from "@/hooks/useApiCall";
import {createContext} from "react";

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
  const {post, status} = usePost<{username: string; password: string}>(
    "/login"
  );

  const isLogged = status;

  const handleLogin = async (username: string, password: string) => {
    await post({username, password});
    // if (status) setIsLogged(true);
    // else setIsLogged(false);

    console.log(status, isLogged);
  };

  return (
    <AuthContext.Provider value={{isLogged, handleLogin}}>
      {children}
    </AuthContext.Provider>
  );
};
