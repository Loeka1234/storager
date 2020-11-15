import React, { useContext } from "react";
import {
	AiOutlineFileImage,
	AiOutlineFile,
	AiOutlineFileWord,
	AiOutlineFilePdf,
	AiOutlineFileZip,
	AiOutlineSound,
	AiOutlineFileGif,
	AiOutlineHtml5,
	AiOutlineFileText,
} from "react-icons/ai";
import { DiJava } from "react-icons/di";
import { SiMidi } from "react-icons/si";
import { ImFileVideo } from "react-icons/im";
import { Box, BoxProps } from "@chakra-ui/react";
import { OptimizerContext } from "./../contexts/OptimizerContext";

type FileIconProps = BoxProps & {
	mimeType: string;
};

export const FileIcon: React.FC<FileIconProps> = ({ mimeType, ...rest }) => {
	const { addNotImplementedFileIcon } = useContext(OptimizerContext)!;

	return (
		<Box as={getFileIcon(mimeType, addNotImplementedFileIcon)} {...rest} />
	);
};

const getFileIcon = (mimeType: string, onErr?: (s: string) => void) => {
	switch (mimeType) {
		case "image/png":
		case "image/jpeg":
			return AiOutlineFileImage;
		case "application/msword":
			return AiOutlineFileWord;
		case "application/pdf":
			return AiOutlineFilePdf;
		case "application/x-java-archive":
		case "application/x-java-serialized-object":
		case "application/x-java-vm":
			return DiJava;
		case "application/x-tar":
		case "application/zip":
		case "multipart/x-gzip":
		case "multipart/x-zip":
			return AiOutlineFileZip;
		case "audio/x-midi":
			return SiMidi;
		case "audio/x-wav":
			return AiOutlineSound;
		case "image/gif":
			return AiOutlineFileGif;
		case "text/html":
			return AiOutlineHtml5;
		case "text/plain":
			return AiOutlineFileText;
		case "video/mpeg":
		case "video/vnd.vivo":
		case "video/quicktime":
		case "video/x-msvideo":
		case "video/mp4":
			return ImFileVideo;
		default:
			if (onErr) onErr(mimeType);
			return AiOutlineFile;
	}
};
