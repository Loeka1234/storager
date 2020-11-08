import React, { createContext, useCallback, useState } from "react";
import axios from "axios";

const LIMIT = 15;
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

export const FileListContext = createContext<ContextTypes | null>(null); // Context that stores files and setFiles

export const FileListProvider: React.FC = ({ children }) => {
  const [files, setFiles] = useState<FileMetadata[] | null>(
    FILES_INITIAL_STATE
  );
  const [newFilesToFetch, setNewFilesToFetch] = useState(
    NEW_FILES_TO_FETCH_INITIAL_STATE
  );

  const initialFetch = useCallback(async () => {
    const files = await axios
      .get(`/file/metadata?limit=${LIMIT}`)
      .then(res => res.data);

    if (files.length < LIMIT) setNewFilesToFetch(false);
    setFiles(files);
  }, []);

  const fetchMore = async () => {
    if (!files) return;

    const offset = files.length;

    const newFiles = (await axios
      .get(`/file/metadata?limit=${LIMIT}&offset=${offset}`)
      .then(res => res.data)) as FileMetadata[];

    if (newFiles.length < LIMIT) setNewFilesToFetch(false);

    setFiles([...files, ...newFiles]);
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
