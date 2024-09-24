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

export const sendData = async (url: string, payload: UserData) => {
  try {
    const response = await axios.post(`${BASE_URL}${url}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error Posting Data", error);
  }
};

export const fetchData = async (url: string) => {
  try {
    const response = await axios.get(`${BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Data", error);
  }
};

export const removeData = async (url: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    console.error("Error Deleting Data", error);
  }
};
