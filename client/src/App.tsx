import {useState} from "react";
import {Navbar} from "./components/Navbar";
import {SidebarMenu} from "./components/SidebarMenu";
import {Navigate, Route, Routes} from "react-router-dom";
import {AddUser} from "./pages/users/AddUser";
import {AllUsers} from "./pages/users/AllUsers";
import {AddDepartment} from "./pages/Departments/AddDepartment";
import {AllDepartments} from "./pages/Departments/AllDepartments";
import {AddEmployee} from "./pages/Employees/AddEmployee";
import {AllEmployees} from "./pages/Employees/AllEmployees";
import {Toaster} from "react-hot-toast";
import {MasterDetailsContainer} from "./components/MasterDetailsContainer";
import {WidgetContainer} from "./components/WidgetContainer";
import {Login} from "./pages/Login/Login";
import {useAuthContext} from "./hooks/useAuth";
import {NotificationsContainer} from "./components/NotificationsContainer";
import {InboxPage} from "./pages/Notifications/InboxPage";
import {SentPage} from "./pages/Notifications/SentPage";
import {DraftPage} from "./pages/Notifications/DraftPage";
import {DetailsPage} from "./pages/Notifications/DetailsPage";

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const {isLogged} = useAuthContext();
  return (
    <>
      {isLogged ? (
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
                <Route
                  path="/master_details"
                  element={<MasterDetailsContainer />}
                />
                <Route path="/widget" element={<WidgetContainer />} />
                <Route
                  path="/notification"
                  element={<NotificationsContainer />}
                >
                  <Route path="" element={<Navigate to="inbox" />} />
                  <Route path="inbox" element={<InboxPage />} />
                  <Route path="inbox/:id" element={<DetailsPage />} />
                  <Route path="sent" element={<SentPage />} />
                  <Route path="sent/:id" element={<DetailsPage />} />
                  <Route path="draft" element={<DraftPage />} />
                  <Route path="draft/:id" element={<DetailsPage />} />
                </Route>
              </Routes>
              <Toaster />
            </div>
          </div>
        </>
      ) : (
        <Login />
      )}
    </>
  );
}

export default App;
