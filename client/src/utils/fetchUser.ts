import axios from "axios";
import { User } from "../contexts/UserContext";

export const fetchUser = async (): Promise<User | null> => {
  try {
    const res = await axios.get("/me");

    console.log(res);
    return res.data;
  } catch (error) {
    return null;
  }
};
