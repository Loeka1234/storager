import React, { createContext, useCallback, useState } from "react";
import { searchMetadata } from "../requests/searchMetadata";

const LIMIT = 20;

interface ContextTypes {
  files?: FileMetadata[];
  searchFiles: (searchString: string) => Promise<void>;
  fetchMore: () => Promise<void>;
  newFilesToFetch: boolean;
  reset: (refetch?: boolean) => void;
}

export const SearchFilesContext = createContext<ContextTypes | null>(null);

export const SearchFilesProvider: React.FC = ({ children }) => {
  const [searchString, setSearchString] = useState<string>();
  const [files, setFiles] = useState<FileMetadata[]>();
  const [newFilesToFetch, setNewFilesToFetch] = useState(true);
  const [page, setPage] = useState(0);

  const searchFiles = useCallback(async (searchString: string) => {
    reset();
    setSearchString(searchString);

    const newFiles = await searchMetadata(searchString, {
      limit: LIMIT,
    });
    setFiles(newFiles);
    if (newFiles.length < LIMIT) setNewFilesToFetch(false);
    if (newFiles.length > 0) setPage(p => p + 1);
  }, []);

  const fetchMore = async () => {
    if (!newFilesToFetch || !searchString) return;

    const newFiles = await searchMetadata(searchString, {
      limit: LIMIT,
      page,
    });
    setFiles(f => (f ? [...f, ...newFiles] : newFiles));
    if (newFiles.length < LIMIT) setNewFilesToFetch(false);
    if (newFiles.length > 0) setPage(p => p + 1);
  };

  const reset = (refetch = false) => {
    setSearchString(undefined);
    setFiles(undefined);
    setNewFilesToFetch(true);
    setPage(0);

    if (refetch && typeof searchString !== "undefined")
      searchFiles(searchString);
  };

  return (
    <SearchFilesContext.Provider
      value={{ files, searchFiles, fetchMore, newFilesToFetch, reset }}
    >
      {children}
    </SearchFilesContext.Provider>
  );
};
