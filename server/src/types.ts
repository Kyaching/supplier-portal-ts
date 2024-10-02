export interface CreateUserData {
  username: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  password: string;
  job_title_id: string;
  job_title: string;
  user_type_id: string;
  user_type: string;
  order: number;
}
export interface DepartmentData {
  id: number;
  dept_name: string;
}
export interface EmployeeData {
  id: string;
  emp_name: string;
  first_name: string;
  last_name: string;
  email: string;
  job_title_id: string;
  dept_id: string;
}

export interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  job_title: string;
  job_title_id: string;
}
export interface NewUserData {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  job_title_id: string;
  user_type_id: string;
}
