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
	useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { FileUploaderDropArea } from "./FileUploaderDropArea";
import axios, { AxiosError } from "axios";
import { GrFormCheckmark } from "react-icons/gr";
import { FileListContext } from "../../contexts/FileListContext";
import { UserContext } from "../../contexts/UserContext";
import { BiErrorCircle } from "react-icons/bi";
import { defaultErrorToastKeys } from "../../utils/defaultErrorToastKeys";

interface UploadProgress {
	[key: string]: {
		state: "pending" | "error" | "finished";
		percentage: number;
	};
}

const FILES_INITIAL_STATE: File[] = [];
const UPLOAD_PROGRESS_INITIAL_STATE = {};
const UPLOAD_STATE_INITIAL_STATE: uploadState = "none";

type uploadState = "none" | "uploading" | "finished";

export interface FileUploaderProps {
	isOpen: boolean;
	handleClose: () => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
	isOpen,
	handleClose,
}) => {
	const [files, setFiles] = useState<(File | null)[]>(FILES_INITIAL_STATE);
	const [uploadState, setUploadState] = useState<uploadState>(
		UPLOAD_STATE_INITIAL_STATE
	);
	const [uploadProgress, setUploadProgress] = useState<UploadProgress>(
		UPLOAD_PROGRESS_INITIAL_STATE
	);
	const { reset: resetFileList } = useContext(FileListContext)!;
	const [, setUser] = useContext(UserContext)!;
	const toast = useToast();

	const uploadFiles = () => {
		setUploadState("uploading");
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
								(progressEvent.loaded / progressEvent.total) *
									100 *
									100
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
				.then(res => {
					setUploadProgress(old => ({
						...old,
						[file.name]: {
							state: "finished",
							percentage: 100,
						},
					}));

					if (res.data.fileSizeUploaded)
						setUser(user =>
							user
								? {
										...user,
										usedStorage:
											user.usedStorage +
											res.data.fileSizeUploaded,
								  }
								: user
						);
				})
				.catch((err: AxiosError) => {
					toast({
						...defaultErrorToastKeys,
						title: "Uploading failed",
						description:
							err.response?.data.error ||
							"Internal server error.",
					});
					setUploadProgress(p => ({
						...p,
						[file.name]: {
							state: "error",
							percentage: 0,
						},
					}));
				});
			if (i === files.length - 1) setUploadState("finished");
		});
	};

	const resetToInitialState = () => {
		setFiles(FILES_INITIAL_STATE);
		setUploadState(UPLOAD_STATE_INITIAL_STATE);
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
					<FileUploaderDropArea
						onFilesAdded={newFiles =>
							setFiles(files => [...files, ...newFiles])
						}
						disabled={
							uploadState === "uploading" ||
							uploadState === "finished"
						}
					/>
					<Box w="100%">
						{files.map(file => {
							if (!file) return null;

							const state = uploadProgress[file.name]?.state;

							return file ? (
								<Flex
									key={file.name}
									justify="space-between"
									align="center"
									w="100%"
								>
									<Text>{file.name}</Text>
									{state === "error" ? (
										<Box
											as={BiErrorCircle}
											color="red"
											w="32px"
											z="32px"
										/>
									) : state === "finished" ? (
										<Box as={GrFormCheckmark} boxSize="32px" />
									) : (
										uploadProgress[file.name]?.percentage
									)}
								</Flex>
							) : null;
						})}
					</Box>
				</ModalBody>

				<ModalFooter>
					{uploadState === "finished" ? (
						<Button
							colorScheme="red"
							mr={3}
							onClick={closeFileUploader}
						>
							Close
						</Button>
					) : (
						<Button
							colorScheme="teal"
							mr={3}
							onClick={uploadFiles}
							isLoading={uploadState === "uploading"}
						>
							Upload
						</Button>
					)}
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
