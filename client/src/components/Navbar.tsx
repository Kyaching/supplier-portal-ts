import {useState} from "react";
import {FiBell, FiHome, FiMail, FiMenu, FiX} from "react-icons/fi";
import {GoTasklist} from "react-icons/go";
import {NavLink} from "react-router-dom";
import {NavbarProps, navItems} from "../utilities/types";

const navLists: navItems[] = [
  {name: "Home", icon: <FiHome />},
  {name: "Alerts", icon: <FiBell />},
  {name: "Tasks", icon: <GoTasklist />},
  {name: "Notification", icon: <FiMail />},
];

export const Navbar: (props: NavbarProps) => JSX.Element = ({setCollapsed}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCollapsed = () => {
    setCollapsed(prev => !prev);
    setIsOpen(prev => !prev);
  };
  return (
    <nav className=" p-3 border-b border-b-[#18B192] shadow-md font-semibold text-lg">
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
                className="flex items-center gap-1 hover:bg-[#18B192] hover:text-white rounded-sm p-2"
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M16.5 12.5c0 .828-.56 1.5-1.25 1.5s-1.25-.672-1.25-1.5.56-1.5 1.25-1.5 1.25.672 1.25 1.5zm-7.75-1.5c-.69 0-1.25.672-1.25 1.5s.56 1.5 1.25 1.5 1.25-.672 1.25-1.5-.56-1.5-1.25-1.5zm15.25 2.313c0 1.765-.985 3.991-3.139 4.906-2.348 3.731-5.484 5.781-8.861 5.781-3.377 0-6.513-2.05-8.862-5.781-2.153-.915-3.138-3.141-3.138-4.906 0-2.053.754-3.026 1.417-3.489-.39-1.524-1.03-5.146.963-7.409.938-1.065 2.464-1.54 4.12-1.274 1.301-.557 3.266-1.141 5.5-1.141s4.199.584 5.5 1.141c1.656-.266 3.182.208 4.12 1.274 1.993 2.263 1.354 5.885.963 7.409.663.463 1.417 1.435 1.417 3.489zm-9.6 4.687h-4.8s.678 1.883 2.4 1.883c1.788 0 2.4-1.883 2.4-1.883zm7.02-6.553c-.235-.152-.531-.115-.672-.053-.661.292-1.406-.191-1.406-.914 0-2.214-.692-4.434-2.154-5.988l-.015-.01c-2.604-2.596-3.02-.482-5.173-.482s-2.569-2.114-5.173.482l-.015.01c-1.462 1.554-2.154 3.774-2.154 5.988 0 .723-.745 1.206-1.406.914-.184-.082-.468-.079-.672.053-1 .651-.893 4.184 1.554 5.012 1 .339 2.579 3.361 4.289.432.59-1.012 2.455-1.126 3.578-.322 1.124-.804 2.988-.69 3.578.322 1.709 2.929 3.288-.093 4.289-.432 2.446-.828 2.552-4.361 1.552-5.012z" />
        </svg>
      </div>
    </nav>
  );
};
