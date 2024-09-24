// Navbar Types
export interface NavbarProps {
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  handleCollapsed?: () => void;
}
export interface navItems {
  name: string;
  icon: JSX.Element;
}

/* SideBar Types */
export interface SidebarProps {
  collapsed: boolean;
}
export interface subItem {
  name: string;
  icon: JSX.Element;
  to: string;
}
export interface IMenuItem {
  name: string;
  icon: JSX.Element;
  items: subItem[];
}

/** Users Types */
type UserFields =
  | "username"
  | "first_name"
  | "middle_name"
  | "last_name"
  | "email"
  | "password"
  | "job_title"
  | "job_title_id"
  | "user_type"
  | "user_type_id";

export interface IInputItem {
  id: number;
  title: string;
  name: UserFields;
  type?: string;
}
/** Department Types */
type DepartmentFields = "id" | "dept_name";
export interface IDepartmentItem {
  title: string;
  name: DepartmentFields;
  type: string;
}

/** Employees Types */
type EmployeeFields =
  | "emp_name"
  | "job_title"
  | "first_name"
  | "last_name"
  | "email"
  | "dept_name";
export interface IEmployeeItem {
  title: string;
  name: EmployeeFields;
  type: string;
}

/** User Data Types */
export type job_title = {
  name: string;
};

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  job_title: job_title;
  job_title_id: string;
}
export interface Department {
  id: number;
  dept_name: string;
}

export interface FormValues {
  id: string;
  first_name: string;
  last_name: string;
  job_title: string;
  job_title_id: string;
}
