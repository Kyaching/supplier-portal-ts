import {NavLink} from "react-router-dom";
interface OptionProps {
  icon: JSX.Element;
  name: string;
  count: number;
  to: string;
}

export const Option: React.FC<OptionProps> = ({icon, name, count, to}) => {
  return (
    <NavLink
      to={to || "inbox"}
      className="cursor-pointer p-3 flex gap-5 items-center justify-between hover:bg-gray-300"
    >
      <div className="flex gap-2 items-center justify-centers text-md font-semibold">
        {icon}
        <span>{name}</span>
      </div>
      <div className="flex items-center justify-center w-6 h-6 bg-gray-500 text-white text-sm rounded-full font-bold">
        <span>{count}</span>
      </div>
    </NavLink>
  );
};
