import React, { useState } from "react";
import {
  CircularProgress,
  Flex,
  Heading,
  Icon,
  IconProps,
  Img,
  Text,
} from "@chakra-ui/react";
import { getPreviewImageURL } from "../../utils/getPreviewImageURL";
import { MdClose } from "react-icons/md";
import { RiDownloadLine } from "react-icons/ri";

export interface ImagePreviewerProps {
  handleDownload: () => Promise<void>;
  file: FileMetadata;
  closePreview: () => void;
}

export const ImagePreviewer: React.FC<ImagePreviewerProps> = ({
  file: { fileName, realName },
  closePreview,
  handleDownload,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(false);

  const iconProps: IconProps = {
    boxSize: 42,
    m: 4,
    color: "white",
    transition: "background .3s ease-in-out",
    _hover: { background: "rgba(255, 255, 255, .1)" },
    p: 1,
    cursor: "pointer",
  };

  return (
    <Flex
      pos="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      align="center"
      justify="center"
      flexDir="column"
      background="rgba(0, 0, 0, .7)"
      zIndex={100}
    >
      <Flex
        pos="fixed"
        top={0}
        left={0}
        right={0}
        align="center"
        justify="flex-end"
      >
        <Icon
          as={RiDownloadLine}
          {...iconProps}
          mx={1}
          onClick={handleDownload}
        />
        <Icon as={MdClose} {...iconProps} ml={1} onClick={closePreview} />
      </Flex>
      {imageLoaded ? (
        <Heading color="white" size="md" mb={2} fontWeight={600}>
          {realName}
        </Heading>
      ) : error ? (
        <Text color="white" fontSize="32px">Failed to load image.</Text>
      ) : (
        <CircularProgress isIndeterminate color="teal.500" size={100} />
      )}
      <Img
        maxW="80%"
        maxH="80%"
        src={getPreviewImageURL(fileName)}
        mb={2}
        onLoad={() => setImageLoaded(true)}
        onError={() => setError(true)}
        alt="image"
        display={error ? "none" : undefined}
      />
    </Flex>
  );
};
