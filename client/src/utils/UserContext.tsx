import React, { useEffect, useState, createContext } from "react";
import { fetchUser } from "./fetchUser";

export interface User {
  username: string;
}

export const UserContext = createContext<
  [User | null, React.Dispatch<React.SetStateAction<User | null>>] | null // Usestate type or null
>(null);

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<null | User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAuth = async () => {
      setUser(await fetchUser());
      setLoading(false);
    };
    getAuth();
  }, []);

  return (
    <UserContext.Provider value={[user, setUser]}>
      {!loading ? children : null}
      {/* TODO: add loader */}
    </UserContext.Provider>
  );
};
