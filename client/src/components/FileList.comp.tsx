import React, { useContext, useEffect } from "react";
import { Button, Flex, Grid, PseudoBox, Text } from "@chakra-ui/core";
import { FileIcon } from "./FileIcon.comp";
import { FileListContext } from "../contexts/FileListContext";

export interface FileListProps {}

export const FileList: React.FC<FileListProps> = () => {
  const [files] = useContext(FileListContext)!.fileState;
  const [newFilesToFetch] = useContext(FileListContext)!.newFileState;
  const { initialFetch, fetchMore } = useContext(FileListContext)!;

  useEffect(() => {
    initialFetch();
  }, [initialFetch]);

  return (
    <>
      <Grid
        templateColumns="repeat(auto-fill, 300px)"
        w="100%"
        maxW="1050px"
        justifyContent="center"
        gap={2}
        mt={2}
      >
        {files?.map(({ realName, fileName, mimeType }) => (
          <PseudoBox
            backgroundColor="gray.200"
            transition="all .3s ease-in-out"
            borderRadius={3}
            _hover={{
              backgroundColor: "gray.300",
            }}
            key={fileName}
          >
            <Flex h="50px" justify="flex-start" align="center" cursor="pointer">
              <FileIcon mimeType={mimeType} size="32px" minW="32px" mx={2} />
              <Text mr={2} isTruncated>
                {realName}
              </Text>
            </Flex>
          </PseudoBox>
        ))}
      </Grid>
      {newFilesToFetch && (
        <Button mt={2} onClick={fetchMore}>
          More files...
        </Button>
      )}
    </>
  );
};
