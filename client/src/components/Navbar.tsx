import {useEffect, useState} from "react";
import {FiBell, FiHome, FiLogOut, FiMail, FiMenu, FiX} from "react-icons/fi";
import {GoTasklist} from "react-icons/go";
import {NavLink} from "react-router-dom";
import {NavbarProps, navItems} from "../utilities/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar";
import image from "../assets/user.png";
import {Button} from "./ui/button";
import {useAuthContext} from "@/hooks/useAuth";
import {useNotificationContext} from "@/hooks/useNotification";
const navLists: navItems[] = [
  {name: "home", icon: <FiHome />},
  {name: "alerts", icon: <FiBell />},
  {name: "tasks", icon: <GoTasklist />},
  {name: "notification", icon: <FiMail />},
];

export const Navbar: (props: NavbarProps) => JSX.Element = ({setCollapsed}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {handleLogOut, user, messageId, socket, setMessageId} =
    useAuthContext();
  const {inboxMessage, refetchInbox} = useNotificationContext();

  useEffect(() => {
    if (typeof user === "string") {
      const unreadMessage = inboxMessage?.filter(msg =>
        msg.read?.includes(user)
      );
      setMessageId(unreadMessage.flatMap(msg => msg.id));
    }
  }, [inboxMessage, user, setMessageId]);

  socket.on("read_message", async (msg: {id: string}) => {
    await refetchInbox();
    setMessageId(messageId?.filter(mess => mess !== msg.id));
  });
  const handleCollapsed = () => {
    setCollapsed(prev => !prev);
    setIsOpen(prev => !prev);
  };

  return (
    <nav className="p-3 border-b border-b-[#18B192] shadow-md font-semibold text-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={handleCollapsed}>
            {isOpen ? (
              <FiMenu className="w-6 h-6"></FiMenu>
            ) : (
              <FiX className="w-6 h-6"></FiX>
            )}
          </button>
          <img src="/logo/logo.jpg" className="max-h-20 max-w-16" />
        </div>
        <ul className="flex items-center gap-4">
          {navLists.map(item => (
            <li key={item.name}>
              <NavLink
                to={`/${item.name}`}
                className={({isActive}) =>
                  `flex items-center gap-1 hover:bg-[#18B192] hover:text-white rounded-sm p-2 ${
                    isActive ? "bg-[#18B192] text-white" : ""
                  }`
                }
              >
                <span>{item.icon}</span>
                {item.name === "notification" ? (
                  <div className="relative">
                    <span className="capitalize">{item.name}</span>
                    {messageId?.length > 0 && (
                      // || unreadMessages?.length > 0)
                      <span className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-sm font-semibold">
                        {
                          messageId?.length
                          //  || unreadMessages?.length
                        }
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="capitalize">{item.name}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
        <DropdownMenu>
          <DropdownMenuTrigger className="mr-2" asChild>
            <div className="flex gap-1">
              <Avatar className="cursor-pointer w-8 h-8">
                <AvatarImage src={image} />
                <AvatarFallback>Avatar</AvatarFallback>
              </Avatar>
              <span>{user}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 mr-4">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button onClick={handleLogOut} variant="outline">
                <FiLogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
