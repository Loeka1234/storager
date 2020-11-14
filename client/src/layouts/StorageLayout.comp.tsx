import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import { NAVBAR_HEIGHT } from "../constants";
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
      <Flex minH={`calc(100vh - ${NAVBAR_HEIGHT}px)`}>
        <Navigation />
        <Box
          flexGrow={1}
          overflowX="hidden"
          overflowY="scroll"
          height={`calc(100vh - ${NAVBAR_HEIGHT}px)`}
        >
          <Flex
            as="main"
            align="center"
            flexDir="column"
            flexGrow={1}
            minH="150vh"
            w="100%"
          >
            {children}
          </Flex>
        </Box>
      </Flex>
    </>
  );
};
