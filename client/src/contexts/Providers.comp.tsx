import React from "react";
import { UserProvider } from "./UserContext";
import { FileListProvider } from "./FileListContext";
import { OptimizerProvider } from "./OptimizerContext";

export const Providers: React.FC = ({ children }) => {
	return (
		<OptimizerProvider>
			<UserProvider>
				<FileListProvider>{children}</FileListProvider>
			</UserProvider>
		</OptimizerProvider>
	);
};
