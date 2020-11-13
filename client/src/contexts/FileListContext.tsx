import React, { createContext, useCallback, useState } from "react";
import axios from "axios";

const LIMIT = 5;
const FILES_INITIAL_STATE = null;
const NEW_FILES_TO_FETCH_INITIAL_STATE = true;

interface ContextTypes {
	fileState: [
		FileMetadata[] | null,
		React.Dispatch<React.SetStateAction<FileMetadata[] | null>>
	];
	newFileState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
	initialFetch: () => Promise<void>;
	fetchMore: () => Promise<void>;
	reset: () => void;
}

interface Cursor {
	realName: string;
	fileName: string;
}

export const FileListContext = createContext<ContextTypes | null>(null); // Context that stores files and setFiles

export const FileListProvider: React.FC = ({ children }) => {
	const [files, setFiles] = useState<FileMetadata[] | null>(
		FILES_INITIAL_STATE
	);
	const [newFilesToFetch, setNewFilesToFetch] = useState(
		NEW_FILES_TO_FETCH_INITIAL_STATE
	);
	const [cursor, setCursor] = useState<Cursor | null>(null);

	const updateCursorFromFileArray = (files: FileMetadata[]) => {
		setCursor({
			fileName: files[files.length - 1].fileName,
			realName: files[files.length - 1].realName,
		});
	};

	const initialFetch = useCallback(async () => {
		const files = await axios
			.get(`/file/cursor-paginated-metadata?limit=${LIMIT}`)
			.then(res => res.data);

		if (files.length < LIMIT) setNewFilesToFetch(false);
		setFiles(files);
		if (files.length > 0) updateCursorFromFileArray(files);
	}, []);

	const fetchMore = async () => {
		if (!files) return;

		const newFiles = (await axios
			.get(
				`/file/cursor-paginated-metadata?limit=${LIMIT}&cursor-realName=${cursor?.realName}&cursor-fileName=${cursor?.fileName}`
			)
			.then(res => res.data)) as FileMetadata[];

		if (newFiles.length < LIMIT) setNewFilesToFetch(false);

		setFiles([...files, ...newFiles]);
		if (newFiles.length > 0) updateCursorFromFileArray(newFiles);
	};

	const reset = () => {
		setFiles(FILES_INITIAL_STATE);
		setNewFilesToFetch(NEW_FILES_TO_FETCH_INITIAL_STATE);
		initialFetch();
	};

	return (
		<FileListContext.Provider
			value={{
				fileState: [files, setFiles],
				newFileState: [newFilesToFetch, setNewFilesToFetch],
				initialFetch,
				fetchMore,
				reset,
			}}
		>
			{children}
		</FileListContext.Provider>
	);
};
