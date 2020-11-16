import React, { useContext, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { FileIcon } from "../FileIcon.comp";
import { displayStorage } from "./../../utils/displayUsedStorage";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { downloadFile } from "../../requests/downloadFile";
import { defaultErrorToastKeys } from "../../utils/defaultErrorToastKeys";
import { RecentFilesContext } from "../../contexts/RecentFilesContext";

export interface RecentFilesProps {}

export const RecentFiles: React.FC<RecentFilesProps> = () => {
  const {
    pages: { initialFetch, nextPage, prevPage },
    loading,
    files,
    oldCursors,
    newPageToFetch,
  } = useContext(RecentFilesContext)!;
  const toast = useToast();

  useEffect(() => {
    if (!files) initialFetch();
  }, [initialFetch, files]);

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
    <Flex
      w="100%"
      justifyContent="flex-start"
      alignItems="center"
      flexDir="column"
    >
      {files?.map(({ updatedAt, mimeType, realName, size, fileName }) => (
        <Flex
          key={fileName}
          alignItems="center"
          _hover={{
            backgroundColor: "gray.300",
          }}
          w="95%"
          backgroundColor="gray.200"
          my={2}
          p={3}
          borderRadius={3}
          position="relative"
          cursor="pointer"
          transition="all .3s ease-in-out"
          onClick={() => handleDownload(fileName, mimeType, realName)}
        >
          <FileIcon mimeType={mimeType} boxSize="42px" />
          <Heading
            as="h2"
            fontSize="2xl"
            mx={2}
            fontWeight={500}
            flexGrow={2}
            maxW="60%"
            isTruncated
          >
            {realName}
          </Heading>
          <Box position="absolute" right={2} bottom={0.5}>
            <Text float="left">{new Date(updatedAt).toLocaleString()}</Text>
            <Text float="left" ml={2} fontWeight="bold">
              {displayStorage(size)}
            </Text>
          </Box>
        </Flex>
      ))}
      <Box>
        <IconButton
          icon={<ArrowBackIcon boxSize="60%" />}
          boxSize={50}
          aria-label="previous"
          mx={2}
          onClick={prevPage}
          disabled={oldCursors.length <= 1}
          isLoading={loading.prev}
        />
        <IconButton
          icon={<ArrowForwardIcon boxSize="60%" />}
          boxSize={50}
          aria-label="next"
          mx={2}
          onClick={nextPage}
          disabled={!newPageToFetch}
          isLoading={loading.next}
        />
      </Box>
    </Flex>
  );
};
