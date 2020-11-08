import {
  Box,
  Button,
  Flex,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/core";
import React, { useContext, useState } from "react";
import { FileUploaderDropArea } from "./FileUploaderDropArea";
import axios from "axios";
import { GrFormCheckmark } from "react-icons/gr";
import { FileListContext } from "../../contexts/FileListContext";

interface UploadProgress {
  [key: string]: {
    state: string;
    percentage: number;
  };
}

const FILES_INITIAL_STATE: File[] = [];
const SUCCESSFULL_UPLOADED_INITIAL_STATE = false;
const UPLOAD_PROGRESS_INITIAL_STATE = {};

export interface FileUploaderProps {
  isOpen: boolean;
  handleClose: () => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  isOpen,
  handleClose,
}) => {
  const [files, setFiles] = useState<(File | null)[]>(FILES_INITIAL_STATE);
  const [successfullUploaded, setSuccessfullUploaded] = useState(
    SUCCESSFULL_UPLOADED_INITIAL_STATE
  );
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>(
    UPLOAD_PROGRESS_INITIAL_STATE
  );
  const { reset: resetFileList } = useContext(FileListContext)!;

  const uploadFiles = () => {
    setUploadProgress({});
    files.forEach((file, i) => {
      if (!file) return;

      const body = new FormData();
      body.append("file", file, file.name);

      axios
        .post("/file/upload", body, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent: ProgressEvent) => {
            const percentage =
              Math.round(
                (progressEvent.loaded / progressEvent.total) * 100 * 100
              ) / 100;

            setUploadProgress(old => ({
              ...old,
              [file.name]: {
                state: "pending",
                percentage: percentage,
              },
            }));
          },
        })
        .then(() => {
          setUploadProgress(old => ({
            ...old,
            [file.name]: {
              state: "finished",
              percentage: 100,
            },
          }));

          if (i === files.length - 1) setSuccessfullUploaded(true);
        })
        .catch(() => {
          console.error("Error while uploading file.");
          setUploadProgress({
            ...uploadProgress,
            [file.name]: {
              state: "error",
              percentage: 0,
            },
          });
        });
    });
  };

  const resetToInitialState = () => {
    setFiles(FILES_INITIAL_STATE);
    setSuccessfullUploaded(SUCCESSFULL_UPLOADED_INITIAL_STATE);
    setUploadProgress(UPLOAD_PROGRESS_INITIAL_STATE);
  };

  const closeFileUploader = () => {
    resetToInitialState();
    resetFileList();
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeFileUploader} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload files</ModalHeader>
        <ModalCloseButton onClick={closeFileUploader} />
        <ModalBody pb={6}>
          {/* TODO: Implement file uploader */}
          <FileUploaderDropArea
            onFilesAdded={newFiles =>
              setFiles(files => [...files, ...newFiles])
            }
            disabled={false}
          />
          <Box w="100%">
            {files.map(file =>
              file ? (
                <Flex
                  key={file.name}
                  justify="space-between"
                  align="center"
                  w="100%"
                >
                  <Text>{file.name}</Text>
                  {uploadProgress[file.name]?.percentage === 100 ? (
                    <Box as={GrFormCheckmark} size="32px" />
                  ) : (
                    uploadProgress[file.name]?.percentage
                  )}
                </Flex>
              ) : null
            )}
          </Box>
        </ModalBody>

        <ModalFooter>
          {successfullUploaded ? (
            <Button variantColor="red" mr={3} onClick={closeFileUploader}>
              Close
            </Button>
          ) : (
            <Button variantColor="teal" mr={3} onClick={uploadFiles}>
              Upload
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
