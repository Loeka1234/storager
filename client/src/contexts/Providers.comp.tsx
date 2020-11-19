import React from "react";
import { UserProvider } from "./UserContext";
import { FileListProvider } from "./FileListContext";
import { OptimizerProvider } from "./OptimizerContext";
import { RecentFilesProvider } from "./RecentFilesContext";
import { SearchFilesProvider } from "./SearchFilesContext";

export const Providers: React.FC = ({ children }) => {
  return (
    <OptimizerProvider>
      <UserProvider>
        <RecentFilesProvider>
          <FileListProvider>
            <SearchFilesProvider>{children}</SearchFilesProvider>
          </FileListProvider>
        </RecentFilesProvider>
      </UserProvider>
    </OptimizerProvider>
  );
};
