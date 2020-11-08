import React from "react";
import { UserProvider } from "./UserContext";
import { FileListProvider } from "./FileListContext";

export const Providers: React.FC = ({ children }) => {
  return (
    <UserProvider>
      <FileListProvider>{children}</FileListProvider>
    </UserProvider>
  );
};
