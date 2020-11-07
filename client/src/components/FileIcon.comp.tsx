import React from "react";
import { AiOutlineFileImage, AiOutlineFile } from "react-icons/ai";
import { Box, BoxProps } from "@chakra-ui/core";

type FileIconProps = BoxProps & {
  mimeType: string;
};

export const FileIcon: React.FC<FileIconProps> = ({ mimeType, ...rest }) => {
  switch (mimeType) {
    case "image/png":
      return <Box as={AiOutlineFileImage} {...rest} />;
    default:
      return <Box as={AiOutlineFile} {...rest} />;
  }
};
