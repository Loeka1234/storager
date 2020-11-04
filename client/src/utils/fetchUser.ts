import axios from "axios";
import { API_ENDPOINT } from "../constants";
import { User } from "./UserContext";

export const fetchUser = async (): Promise<User | null> => {
  try {
    const res = await axios.get(API_ENDPOINT + "/me", {
      withCredentials: true,
    });

    console.log(res);
    return res.data;
  } catch (error) {
    return null;
  }
};
