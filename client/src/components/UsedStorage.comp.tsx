import { Text, Box, Progress } from "@chakra-ui/core";
import * as React from "react";
import { UserContext } from "../contexts/UserContext";
import { displayStorage } from "./../utils/displayUsedStorage";

export const UsedStorage: React.FC = () => {
	const [user] = React.useContext(UserContext)!;

	if (!user) throw new Error("UsedStorage component has no user.");

	const percentage = (user.usedStorage / user.maxStorage) * 100;

	return (
		<Box w="80%" mx="auto" mt={2}>
			<Text>
				{displayStorage(user?.usedStorage)} /{" "}
				{displayStorage(user?.maxStorage)}
			</Text>
			<Progress
				w="100%"
				value={percentage}
				color={
					percentage < 60
						? "teal"
						: percentage < 80
						? "orange"
						: "red"
				}
			/>
		</Box>
	);
};
