import { Flex } from "@chakra-ui/react";
import { FileList } from "../components/FileList.comp";
import React, { useContext } from "react";
import { FilePreviewerProvider } from "../contexts/FilePreviewerContext";
import { FileListContext } from "../contexts/FileListContext";

const MyStoragePage = () => {
  const {
    fileState: [files],
    newFileState: [newFilesToFetch],
    initialFetch,
    fetchMore,
    loading,
  } = useContext(FileListContext)!;

  return (
    <Flex w="100%" align="center" flexDir="column">
      <FilePreviewerProvider>
        <FileList
          files={files}
          newFilesToFetch={newFilesToFetch}
          initialFetch={initialFetch}
          fetchMore={fetchMore}
          loading={loading}
        />
      </FilePreviewerProvider>
    </Flex>
  );
};

export default MyStoragePage;
