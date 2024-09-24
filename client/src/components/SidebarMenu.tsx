import {
  FaRegClipboard,
  FaRegFileAlt,
  FaRegListAlt,
  FaUserFriends,
  FaUserPlus,
  FaUsers,
} from "react-icons/fa";
import {FiUserPlus, FiUsers} from "react-icons/fi";
import {PiUsersThreeFill} from "react-icons/pi";
import {RiDragDropFill} from "react-icons/ri";
import {Menu, MenuItem, Sidebar, SubMenu} from "react-pro-sidebar";
import {Link} from "react-router-dom";
import {IMenuItem, SidebarProps} from "../utilities/types";

const menuItems: IMenuItem[] = [
  {
    name: "User Management",
    icon: <PiUsersThreeFill />,
    items: [
      {name: "Add User", icon: <FiUserPlus />, to: "/adduser"},
      {name: "All Users", icon: <FiUsers />, to: "/allusers"},
    ],
  },
  {
    name: "Departments",
    icon: <FaRegClipboard />,
    items: [
      {name: "Add Departments", icon: <FaRegListAlt />, to: "/adddept"},
      {name: "All Departments", icon: <FaRegFileAlt />, to: "/alldepts"},
    ],
  },
  {
    name: "Employees",
    icon: <FaUsers />,
    items: [
      {name: "Add Employee", icon: <FaUserPlus />, to: "/addemp"},
      {name: "All Employees", icon: <FaUserFriends />, to: "/allemps"},
    ],
  },
];

export const SidebarMenu: (props: SidebarProps) => JSX.Element = ({
  collapsed,
}) => {
  return (
    <div style={{display: "flex", height: "100%"}}>
      <Sidebar collapsed={collapsed}>
        <Menu
          closeOnClick
          menuItemStyles={{
            button: {
              "&:hover": {
                backgroundColor: "#18B192",
                color: "white",
              },
              [`&.active`]: {
                backgroundColor: "#18B192",
                color: "white",
              },
            },
          }}
        >
          {menuItems.map(item => (
            <SubMenu key={item.name} icon={item.icon} label={item.name}>
              {item.items.map(item => (
                <MenuItem
                  component={<Link to={item.to} />}
                  key={item.name}
                  icon={item.icon}
                >
                  {item.name}
                </MenuItem>
              ))}
            </SubMenu>
          ))}
          <MenuItem icon={<RiDragDropFill />}>Widget</MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
};
