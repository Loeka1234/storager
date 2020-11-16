import React, { useContext, useEffect } from "react";
import { Button, Flex, Grid, Text, useToast } from "@chakra-ui/react";
import { FileIcon } from "./FileIcon.comp";
import { FileListContext } from "../contexts/FileListContext";
import { defaultErrorToastKeys } from "./../utils/defaultErrorToastKeys";
import { downloadFile } from "../requests/downloadFile";

export interface FileListProps {}

export const FileList: React.FC<FileListProps> = () => {
  const [files] = useContext(FileListContext)!.fileState;
  const [newFilesToFetch] = useContext(FileListContext)!.newFileState;
  const { initialFetch, fetchMore } = useContext(FileListContext)!;
  const { loading } = useContext(FileListContext)!;
  const toast = useToast();

  useEffect(() => {
    initialFetch();
  }, [initialFetch]);

  const handleDownload = async (
    fileName: string,
    mimeType: string,
    realName: string
  ) => {
    try {
      await downloadFile(fileName, mimeType, realName);
    } catch (err) {
      toast({
        ...defaultErrorToastKeys,
        title: "Internal server error.",
        description:
          "Oops something went wrong while downloading your file. Please try again.",
      });
    }
  };

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
          <Flex
            backgroundColor="gray.200"
            transition="all .3s ease-in-out"
            borderRadius={3}
            _hover={{
              backgroundColor: "gray.300",
            }}
            key={fileName}
            onClick={() => handleDownload(fileName, mimeType, realName)}
            h="50px"
            justify="flex-start"
            align="center"
            cursor="pointer"
          >
            <FileIcon mimeType={mimeType} w="32px" h="32px" mx={2} />
            <Text mr={2} isTruncated>
              {realName}
            </Text>
          </Flex>
        ))}
      </Grid>
      {newFilesToFetch && (
        <Button mt={2} onClick={fetchMore} isLoading={loading}>
          More files...
        </Button>
      )}
    </>
  );
};
