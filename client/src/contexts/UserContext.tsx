import React, { useEffect, useState, createContext } from "react";
import { fetchUser } from "../utils/fetchUser";
import axios from "axios";

export interface User {
	username: string;
	usedStorage: number;
	maxStorage: number;
}

interface IUserContext {
	user: [User | null, React.Dispatch<React.SetStateAction<User | null>>]; // usestate type
	logout: () => Promise<void>;
}

export const UserContext = createContext<IUserContext | null>(null);

export const UserProvider: React.FC = ({ children }) => {
	const [user, setUser] = useState<null | User>(null);
	const [loading, setLoading] = useState(true);

	const logout = async () => {
		try {
			await axios.post("/user/logout");
			setUser(null);
		} catch (error) {
			console.log("Something went wrong while loging out.");
		}
	};

	useEffect(() => {
		const getAuth = async () => {
			setUser(await fetchUser());
			setLoading(false);
		};
		getAuth();
	}, []);

	return (
		<UserContext.Provider value={{ user: [user, setUser], logout }}>
			{!loading ? children : null}
			{/* TODO: add loader */}
		</UserContext.Provider>
	);
};
