import { Flex } from "@chakra-ui/core";
import { FileList } from "../components/FileList.comp";
import React from "react";

const MyStoragePage = () => {
  return (
    <Flex w="100%" align="center" flexDir="column">
      <FileList />
    </Flex>
  );
};

export default MyStoragePage;
