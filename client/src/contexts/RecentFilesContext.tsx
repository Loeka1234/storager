import React, { createContext, useState } from "react";
import { getRecentFileMetadata } from "../requests/getRecentFileMetadata";

const LIMIT = 20;

interface DateCursor {
  updatedAt: string;
  fileName: string;
}

interface Loading {
  prev: boolean;
  next: boolean;
}

interface ContextTypes {
  files: FileMetadata[] | null;
  oldCursors: DateCursor[];
  newCursor: DateCursor | null;
  newPageToFetch: boolean;
  loading: Loading;
  reset: () => void;
  pages: {
    initialFetch: () => Promise<void>;
    prevPage: () => Promise<void>;
    nextPage: () => Promise<void>;
  };
}

const FILES_INIT_STATE = null;
const OLD_CURSORS_INIT_STATE: DateCursor[] = [];
const NEW_CURSORS_INIT_STATE = null;
const NEW_PAGE_TO_FETCH_INIT_STATE = true;
const LOADING_INIT_STATE = {
  prev: false,
  next: false,
};

export const RecentFilesContext = createContext<ContextTypes | null>(null);

export const RecentFilesProvider: React.FC = ({ children }) => {
  const [files, setFiles] = useState<FileMetadata[] | null>(FILES_INIT_STATE);
  const [oldCursors, setOldCursors] = useState<DateCursor[]>(
    OLD_CURSORS_INIT_STATE
  );
  const [newCursor, setNewCursor] = useState<DateCursor | null>(
    NEW_CURSORS_INIT_STATE
  );
  const [newPageToFetch, setNewPageToFetch] = useState(
    NEW_PAGE_TO_FETCH_INIT_STATE
  );
  const [loading, setLoading] = useState<Loading>(LOADING_INIT_STATE);

  const initialFetch = async () => {
    try {
      const data = await getRecentFileMetadata(LIMIT);

      setFiles(data);
      if (data.length > 0) {
        setOldCursors([
          {
            fileName: data[data.length - 1].fileName,
            updatedAt: data[data.length - 1].updatedAt,
          },
        ]);
        setNewCursor({
          fileName: data[data.length - 1].fileName,
          updatedAt: data[data.length - 1].updatedAt,
        });
      }
      if (data.length < LIMIT) setNewPageToFetch(false);
      setLoading({
        prev: false,
        next: false,
      });
    } catch (err) {
      console.log("Something went wrong while getting recent files: ", err);
    }
  };

  const prevPage = async () => {
    setLoading({
      prev: true,
      next: false,
    });
    setNewPageToFetch(true);
    if (oldCursors.length <= 2) return initialFetch();

    const data = await getRecentFileMetadata(LIMIT, {
      updatedAt: oldCursors[oldCursors.length - 2].updatedAt,
      fileName: oldCursors[oldCursors.length - 2].fileName,
    });

    setFiles(data);
    setNewCursor(oldCursors[oldCursors.length - 1]);
    setOldCursors(oldCursors.filter((_, i) => i !== oldCursors.length - 1));
    setLoading({
      prev: false,
      next: false,
    });
  };

  const nextPage = async () => {
    if (!newPageToFetch) return;
    setLoading({
      prev: false,
      next: true,
    });
    if (!newCursor) return initialFetch();

    const data = await getRecentFileMetadata(LIMIT, {
      updatedAt: newCursor.updatedAt,
      fileName: newCursor.fileName,
    });

    if (data.length === 0) {
      return setNewPageToFetch(false);
    }

    setOldCursors(c => [...c, newCursor]);
    setFiles(data);
    setNewCursor(data.length < LIMIT ? null : data[data.length - 1]);
    if (data.length < LIMIT) setNewPageToFetch(false);
    setLoading({
      prev: false,
      next: false,
    });
  };

  const reset = () => {
    setFiles(FILES_INIT_STATE);
    setOldCursors(OLD_CURSORS_INIT_STATE);
    setNewCursor(NEW_CURSORS_INIT_STATE);
    setNewPageToFetch(NEW_PAGE_TO_FETCH_INIT_STATE);
    setLoading(LOADING_INIT_STATE);
    initialFetch();
  };

  return (
    <RecentFilesContext.Provider
      value={{
        files,
        oldCursors,
        newCursor,
        newPageToFetch,
        loading,
        reset,
        pages: {
          initialFetch,
          nextPage,
          prevPage,
        },
      }}
    >
      {children}
    </RecentFilesContext.Provider>
  );
};
