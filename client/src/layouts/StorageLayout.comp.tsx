import { Box, Flex } from "@chakra-ui/core";
import React from "react";
import { useWindowWidth } from "../hooks/useWindowWidth";
import { Header } from "./Header.comp";
import { Navigation } from "./Navigation.comp";

export interface StorageLayoutProps {}

export const StorageLayout: React.FC<StorageLayoutProps> = ({ children }) => {
  const width = useWindowWidth();

  if (typeof width === "undefined") return null;

  return (
    <>
      {width < 700 ? null : <Header />}
      <Flex as="main" minH="100vh">
        <Navigation />
        {children}
      </Flex>
    </>
  );
};
