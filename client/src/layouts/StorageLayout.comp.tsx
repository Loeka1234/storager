import React from "react";
import { useWindowWidth } from "../hooks/useWindowWidth";
import { Header } from "./Header.comp";

export interface StorageLayoutProps {}

export const StorageLayout: React.FC<StorageLayoutProps> = () => {
  const width = useWindowWidth();

  if (typeof width === "undefined") return null;

  return <>{width < 700 ? null : <Header />}</>;
};
