import { Box, Flex, useToast } from "@chakra-ui/core";
import React, { useRef, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";

export interface FileUploaderDropAreaProps {
  onFilesAdded: (files: (File | null)[]) => void;
  disabled: boolean;
}

export const FileUploaderDropArea: React.FC<FileUploaderDropAreaProps> = ({
  onFilesAdded,
  disabled,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [highlight, setHighlight] = useState(false);
  const toast = useToast();

  const handleDrop = (e: React.DragEvent<any>) => {
    e.preventDefault();
    if (disabled) return;

    const { files } = e.dataTransfer;

    console.log(e.dataTransfer.getData(""));

    console.log("FILES: ", files);
    console.log("ARR: ", fileListToArray(files));

    onFilesAdded(fileListToArray(files));
    setHighlight(false);
  };

  const handleFilesAdded = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const { files } = e.target;

    const arr = fileListToArray(files);
    onFilesAdded(arr);
  };

  const fileListToArray = (list: FileList | null) => {
    const array: (File | null)[] = [];

    if (!list) throw new Error("there is no list");

    for (let i = 0; i < list.length; i++) {
      array.push(list.item(i));
    }
    return array;
  };

  return (
    <Flex
      h="200px"
      w="100%"
      border="2px dashe rgb(187, 186, 186)"
      backgroundColor={highlight ? "rgb(188, 185, 236)" : "#fff"}
      align="center"
      justify="center"
      flexDir="column"
      onDragOver={e => {
        e.stopPropagation();
        e.preventDefault();

        if (!disabled) setHighlight(true);
      }}
      onDragLeave={e => {
        e.stopPropagation();
        e.preventDefault();
        setHighlight(false);
      }}
      onDrop={handleDrop}
      onClick={() => (disabled ? null : fileInputRef.current?.click())}
      cursor={disabled ? "default" : "pointer"}
    >
      <input
        type="file"
        multiple
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFilesAdded}
      />
      <Box as={AiOutlineCloudUpload} opacity={0.3} size="64px" />
      <span>Upload Files</span>
    </Flex>
  );
};
