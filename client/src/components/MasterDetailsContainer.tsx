import {Departments} from "@/pages/MasterDetails/Departments";
import {Employees} from "@/pages/MasterDetails/Employees";
import {useState} from "react";

export const MasterDetailsContainer = () => {
  const [ischecked, setIsChecked] = useState<number | null>(null);
  return (
    <div>
      <Departments isChecked={ischecked} setIsChecked={setIsChecked} />
      <Employees isChecked={ischecked} />
    </div>
  );
};
