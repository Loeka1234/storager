import React, { useContext, useEffect } from "react";
import { Button, Flex, Grid, Text, useToast, Image } from "@chakra-ui/react";
import { FileIcon } from "./FileIcon.comp";
import { FileListContext } from "../contexts/FileListContext";
import { defaultErrorToastKeys } from "./../utils/defaultErrorToastKeys";
import { downloadFile } from "../requests/downloadFile";
import { API_ENDPOINT } from "../constants";

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
        templateColumns="repeat(auto-fill, 200px)"
        w="100%"
        maxW="1050px"
        justifyContent="center"
        gap={2}
        mt={2}
      >
        {files?.map(({ realName, fileName, mimeType, thumbnail }) => (
          <Flex
            backgroundColor="gray.200"
            transition="all .3s ease-in-out"
            borderRadius={3}
            _hover={{
              backgroundColor: "gray.300",
            }}
            key={fileName}
            onClick={() => handleDownload(fileName, mimeType, realName)}
            cursor="pointer"
            justify="center"
            align="center"
            flexDir="column"
          >
            <Flex
              h="calc(200px - 50px)"
              w={200}
              justify="center"
              align="center"
              overflow="hidden"
            >
              {thumbnail ? (
                <Image
                  w="100%"
                  src={`${API_ENDPOINT}/file/thumbnail?fileName=${thumbnail}`}
                />
              ) : (
                <Text>No preview</Text>
              )}
            </Flex>
            <Flex justify="flex-start" align="center" h="50px" w="100%">
              <FileIcon mimeType={mimeType} boxSize="32px" minW="32px" mx={1} />
              <Text mr={2} isTruncated>
                {realName}
              </Text>
            </Flex>
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
