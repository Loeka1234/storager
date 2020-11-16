import React from "react";
import { UserProvider } from "./UserContext";
import { FileListProvider } from "./FileListContext";
import { OptimizerProvider } from "./OptimizerContext";
import { RecentFilesProvider } from "./RecentFilesContext";

export const Providers: React.FC = ({ children }) => {
  return (
    <OptimizerProvider>
      <UserProvider>
        <RecentFilesProvider>
          <FileListProvider>{children}</FileListProvider>
        </RecentFilesProvider>
      </UserProvider>
    </OptimizerProvider>
  );
};
