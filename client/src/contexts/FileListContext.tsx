import React, { createContext, useCallback, useState } from "react";
import {
  getFileMetadata,
  PaginatedMetadataCursor,
} from "../requests/getFileMetadata";

const LIMIT = 20;
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
  loading: boolean;
}

export const FileListContext = createContext<ContextTypes | null>(null); // Context that stores files and setFiles

export const FileListProvider: React.FC = ({ children }) => {
  const [files, setFiles] = useState<FileMetadata[] | null>(
    FILES_INITIAL_STATE
  );
  const [newFilesToFetch, setNewFilesToFetch] = useState(
    NEW_FILES_TO_FETCH_INITIAL_STATE
  );
  const [cursor, setCursor] = useState<PaginatedMetadataCursor | null>(null);
  const [loading, setLoading] = useState(false);

  const updateCursorFromFileArray = (files: FileMetadata[]) => {
    setCursor({
      fileName: files[files.length - 1].fileName,
      realName: files[files.length - 1].realName,
    });
  };

  const initialFetch = useCallback(async () => {
    setLoading(true);

    const files = await getFileMetadata(LIMIT);

    if (files.length < LIMIT) setNewFilesToFetch(false);
    setFiles(files);
    if (files.length > 0) updateCursorFromFileArray(files);

    setLoading(false);
  }, []);

  const fetchMore = async () => {
    if (!files) return;

    setLoading(true);

    const newFiles = await getFileMetadata(LIMIT, cursor || undefined);

    if (newFiles.length < LIMIT) setNewFilesToFetch(false);

    setFiles([...files, ...newFiles]);
    if (newFiles.length > 0) updateCursorFromFileArray(newFiles);
    setLoading(false);
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
        loading,
      }}
    >
      {children}
    </FileListContext.Provider>
  );
};
