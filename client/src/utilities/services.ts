import axios from "axios";
import {FormValues, User} from "./types";
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

interface SendResponse {
  success: boolean;
}

export const sendData = async (
  url: string,
  payload: UserData
): Promise<SendResponse> => {
  try {
    const response = await axios.post(`${BASE_URL}${url}`, payload);
    return response.data as SendResponse;
  } catch (error) {
    console.error("Error Posting Data", error);
    throw new Error("Failed To fetch Data");
  }
};

export const fetchData = async (url: string): Promise<User[]> => {
  try {
    const response = await axios.get(`${BASE_URL}${url}`);
    return response.data as User[];
  } catch (error) {
    console.error("Error fetching Data", error);
    throw new Error("Failed To fetch Data");
  }
};

interface RemoveDataResponse {
  message: string; // Adjust this based on your API response
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

export const updateData = async (
  url: string,
  payload: FormValues
): Promise<UpdateResponse> => {
  try {
    const response = await axios.put(`${BASE_URL}${url}`, payload);
    return response.data as UpdateResponse;
  } catch (error) {
    console.error("Error Deleting Data", error);
    throw new Error("Failed To Update Data");
  }
};
