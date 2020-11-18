import { Flex } from "@chakra-ui/react";
import { FileList } from "../components/FileList.comp";
import React from "react";
import { FilePreviewerProvider } from "../contexts/FilePreviewerContext";

const MyStoragePage = () => {
  return (
    <Flex w="100%" align="center" flexDir="column">
      <FilePreviewerProvider>
        <FileList />
      </FilePreviewerProvider>
    </Flex>
  );
};

export default MyStoragePage;
