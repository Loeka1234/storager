import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../constants";
import { Button, Flex, Grid, PseudoBox, Text } from "@chakra-ui/core";
import { FileIcon } from "./FileIcon.comp";

const LIMIT = 15;

interface ResponseFileMetadata {
  fileName: string;
  realName: string;
  mimeType: string;
}

const FILES_INITIAL_STATE = null;
const NEW_FILES_TO_FETCH_INITIAL_STATE = true;

export interface FileListProps {}

export const FileList: React.FC<FileListProps> = () => {
  const [files, setFiles] = useState<ResponseFileMetadata[] | null>(
    FILES_INITIAL_STATE
  );
  const [newFilesToFetch, setNewFilesToFetch] = useState(
    NEW_FILES_TO_FETCH_INITIAL_STATE
  );

  useEffect(() => {
    const fetchFiles = async () => {
      const files = await axios
        .get(API_ENDPOINT + `/file/metadata?limit=${LIMIT}`, {
          withCredentials: true,
        })
        .then(res => res.data);

      if (files.length < LIMIT) setNewFilesToFetch(false);
      setFiles(files);
    };

    fetchFiles();
  }, []);

  const fetchMore = async () => {
    if (!files) return;

    const offset = files.length;

    const newFiles = (await axios
      .get(API_ENDPOINT + `/file/metadata?limit=${LIMIT}&offset=${offset}`, {
        withCredentials: true,
      })
      .then(res => res.data)) as ResponseFileMetadata[];

    if (newFiles.length < LIMIT) setNewFilesToFetch(false);

    setFiles([...files, ...newFiles]);
  };

  const resetToInitialState = () => {
    setFiles(FILES_INITIAL_STATE);
    setNewFilesToFetch(NEW_FILES_TO_FETCH_INITIAL_STATE);

    // TODO: implement file upload reloads this FileList
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
