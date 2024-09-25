import {useState} from "react";
import {Navbar} from "./components/Navbar";
import {SidebarMenu} from "./components/SidebarMenu";
import {Route, Routes} from "react-router-dom";
import {AddUser} from "./pages/users/AddUser";
import {AllUsers} from "./pages/users/AllUsers";
import {AddDepartment} from "./pages/Departments/AddDepartment";
import {AllDepartments} from "./pages/Departments/AllDepartments";
import {AddEmployee} from "./pages/Employees/AddEmployee";
import {AllEmployees} from "./pages/Employees/AllEmployees";
import {Toaster} from "react-hot-toast";

function App() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <Navbar setCollapsed={setCollapsed} />
      <div className="flex">
        <SidebarMenu collapsed={collapsed} />
        <div className="flex-grow">
          <Routes>
            <Route path="/adduser" element={<AddUser />} />
            <Route path="/allusers" element={<AllUsers />} />
            <Route path="/adddept" element={<AddDepartment />} />
            <Route path="/alldepts" element={<AllDepartments />} />
            <Route path="/addEmp" element={<AddEmployee />} />
            <Route path="/allemps" element={<AllEmployees />} />
          </Routes>
          <Toaster />
        </div>
      </div>
    </>
  );
}

export default App;
