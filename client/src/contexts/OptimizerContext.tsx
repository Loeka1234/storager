import React, { createContext, useEffect } from "react";

const notImplementedFileIcons: string[] = [];

interface ContextTypes {
	addNotImplementedFileIcon: (mimeType: string) => void;
}

export const OptimizerContext = createContext<ContextTypes | null>(null);

export const OptimizerProvider: React.FC = ({ children }) => {
	const addNotImplementedFileIcon = (mimeType: string) => {
		if (!notImplementedFileIcons.includes(mimeType)) {
			console.log(`New mimetype without icon: ${mimeType}`);
			notImplementedFileIcons.push(mimeType);
		}
	};

	const saveNotImplementedFileIcons = () => {
		// TODO: Send to backend
	};

	useEffect(() => {
		window.addEventListener("beforeunload", () =>
			saveNotImplementedFileIcons()
		);
	}, []);

	return (
		<OptimizerContext.Provider value={{ addNotImplementedFileIcon }}>
			{children}
		</OptimizerContext.Provider>
	);
};
