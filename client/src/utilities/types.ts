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
export type UserFields =
  | "username"
  | "first_name"
  | "middle_name"
  | "last_name"
  | "email"
  | "password"
  | "job_title"
  | "job_title_id"
  | "user_type"
  | "user_type_id"
  | "tenant_id";

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
  | "job_title_id"
  | "first_name"
  | "last_name"
  | "email"
  | "dept_id";
export interface IEmployeeItem {
  title: string;
  name: EmployeeFields;
  type: string;
  category?: string;
}

/** User Data Types */
export type job_title = {
  id: string;
  name: string;
};
export type user_Type = {
  id: string;
  type: string;
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

export interface Employee {
  id: string;
  emp_name: string;
  first_name: string;
  last_name: string;
  email: string;
  job_title: job_title;
  job_title_id: string;
  departments: Department;
  dept_id: string;
}

export interface FormValues {
  id: string;
  first_name: string;
  last_name: string;
  job_title: string;
  job_title_id: string;
}
