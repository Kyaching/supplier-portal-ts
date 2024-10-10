import axios from "axios";
const BASE_URL = import.meta.env.VITE_SERVER_URL;

export interface UserData {
  username: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  password: string;
  job_title_id: string;
  job_title: string;
  user_type_id: string;
  user_type: string;
}
export interface DepartmentData {
  id: number;
  dept_name: string;
}
export interface EmployeeData {
  emp_name: string;
  first_name: string;
  last_name: string;
  email: string;
  job_title_id: string;
  dept_id: string;
}

interface SendResponse {
  success: boolean;
}

export const sendData = async <T>(
  url: string,
  payload: T
): Promise<SendResponse> => {
  try {
    const response = await axios.post(`${BASE_URL}${url}`, payload, {
      withCredentials: true,
    });
    return response.data as SendResponse;
  } catch (error) {
    console.error("Error Posting Data", error);
    throw new Error("Failed To fetch Data");
  }
};

export const fetchData = async <T>(url: string): Promise<T[]> => {
  try {
    const response = await axios.get(`${BASE_URL}${url}`, {
      withCredentials: true,
    });
    return response.data as T[];
  } catch (error) {
    console.error("Error fetching Data", error);
    throw new Error("Failed To fetch Data");
  }
};

interface RemoveDataResponse {
  message: string;
}

export const removeData = async (url: string): Promise<RemoveDataResponse> => {
  try {
    const response = await axios.delete(`${BASE_URL}${url}`);
    return response.data as RemoveDataResponse;
  } catch (error) {
    console.error("Error Deleting Data", error);
    throw new Error("Failed To Delete Data");
  }
};

interface UpdateResponse {
  message: string;
}

export const updateData = async <T>(
  url: string,
  payload: T
): Promise<UpdateResponse> => {
  try {
    const response = await axios.put(`${BASE_URL}${url}`, payload);
    return response.data as UpdateResponse;
  } catch (error) {
    console.error("Error Deleting Data", error);
    throw new Error("Failed To Update Data");
  }
};
