import React from "react";
import {
	AiOutlineFileImage,
	AiOutlineFile,
	AiOutlineFileWord,
	AiOutlineFieldBinary,
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

type FileIconProps = BoxProps & {
	mimeType: string;
};

export const FileIcon: React.FC<FileIconProps> = ({ mimeType, ...rest }) => {
	return <Box as={getFileIcon(mimeType)} {...rest} />;
};

const getFileIcon = (mimeType: string) => {
	switch (mimeType) {
		case "image/png":
		case "image/jpeg":
			return AiOutlineFileImage;
		case "application/msword":
			return AiOutlineFileWord;
		case "application/octet-stream": // TODO: Fix better icon
			return AiOutlineFieldBinary;
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
			console.log(`Mimetype "${mimeType}" has no icon.`); // TODO: Send to server to improve user experience
			return AiOutlineFile;
	}
};
