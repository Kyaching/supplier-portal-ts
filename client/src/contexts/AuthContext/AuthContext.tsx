import {useGet, usePost} from "@/hooks/useApiCall";
import {
  createContext,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import io from "socket.io-client";

interface AuthContextType {
  isLogged: boolean;
  handleLogin: (username: string, password: string) => void;
  handleLogOut: () => void;
  user: string | string[] | null;
  message: recv_message | null;
  messageId: string[] | null;
  setMessageId: React.Dispatch<SetStateAction<string[]>>;
  notification: recv_message[];
  socket: SocketIOClient.Socket;
}
export type recv_message = {
  id: string;
  subject: string;
  body: string;
  sender: string;
  receivers?: string[];
  date: string;
};
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<string | null>(
    localStorage.getItem("username")
  );
  const [message, setMessage] = useState<recv_message | null>(null);
  const [notification, setNotification] = useState<recv_message[]>([]);
  const [messageId, setMessageId] = useState<string[]>([]);
  const [isLogged, setIsLogged] = useState(false);
  const {data} = useGet<string>("/profile");
  const {post: loginUser} = usePost<{
    username: string;
    password: string | null;
  }>("/login");

  const socket = useMemo(
    () =>
      io("http://localhost:3000", {
        query: {key: user},
      }),
    [user]
  );

  const {post: logoutUser} = usePost<null>("/logout");

  useEffect(() => {
    if (data) {
      setIsLogged(true);
      const savedUser = localStorage.getItem("username");
      setUser(savedUser);
    }
  }, [data]);

  useEffect(() => {
    if (isLogged) {
      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
      });
      socket.on("offline_message", (msg: recv_message[]) => {
        console.log(msg);
      });
      socket.on("receive_message", (msg: recv_message) => {
        setMessageId(prev => [...prev, msg.id]);
        setMessage(msg);
        setNotification(prev => [...prev, msg]);
        console.log("From Server", msg);
      });

      // Clean up the socket connection on logout or component unmount
      return () => {
        socket.disconnect();
      };
    }
  }, [socket, isLogged]);

  console.log("msgId", messageId);

  const handleLogin = async (username: string, password: string) => {
    const response = await loginUser({username, password});
    if (response?.success) {
      setIsLogged(true);
      setUser(username);
      localStorage.setItem("username", username);
    }
  };

  const handleLogOut = async () => {
    await logoutUser(null);
    setUser(null);
    localStorage.removeItem("username");
    setIsLogged(false);
    socket?.disconnect();
  };

  return (
    <AuthContext.Provider
      value={{
        isLogged,
        handleLogin,
        handleLogOut,
        user,
        message,
        socket,
        notification,
        messageId,
        setMessageId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
