import React, { useContext, useEffect } from "react";
import { Button, Flex, Grid, Text, useToast, Image } from "@chakra-ui/react";
import { FileIcon } from "./FileIcon.comp";
import { FileListContext } from "../contexts/FileListContext";
import { defaultErrorToastKeys } from "./../utils/defaultErrorToastKeys";
import { downloadFile } from "../requests/downloadFile";
import { FilePreviewerContext } from "../contexts/FilePreviewerContext";
import { thumbnailToURL } from "../utils/thumbnailToURL";

export interface FileListProps {
  files: FileMetadata[] | null;
  newFilesToFetch: boolean;
  initialFetch?: () => Promise<void>;
  fetchMore: () => Promise<void>;
  loading: boolean;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  newFilesToFetch,
  initialFetch,
  fetchMore,
  loading,
}) => {
  const toast = useToast();
  const { previewFile } = useContext(FilePreviewerContext)!;

  useEffect(() => {
    if (initialFetch) initialFetch();
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
        {files?.map(({ realName, fileName, mimeType, thumbnail, ...rest }) => (
          <Flex
            backgroundColor="gray.200"
            transition="all .3s ease-in-out"
            borderRadius={3}
            _hover={{
              backgroundColor: "gray.300",
            }}
            key={fileName}
            onClick={() =>
              previewFile(
                { realName, fileName, mimeType, thumbnail, ...rest },
                () => handleDownload(fileName, mimeType, realName)
              )
            }
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
                <Image w="100%" src={thumbnailToURL(thumbnail)} />
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
