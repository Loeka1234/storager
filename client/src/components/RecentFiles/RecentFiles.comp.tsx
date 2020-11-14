import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Box, Flex, Heading, Text, IconButton } from "@chakra-ui/react";
import { FileIcon } from "../FileIcon.comp";
import { displayStorage } from "./../../utils/displayUsedStorage";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

const LIMIT = 20;

interface RecentFileMetaData {
	fileName: string;
	realName: string;
	mimeType: string;
	updatedAt: string;
	size: number;
}

interface DateCursor {
	updatedAt: string;
	fileName: string;
}

export interface RecentFilesProps {}

export const RecentFiles: React.FC<RecentFilesProps> = () => {
	const [files, setFiles] = useState<RecentFileMetaData[] | null>(null);
	const [oldCursors, setOldCursors] = useState<DateCursor[]>([]);
	const [newCursor, setNewCursor] = useState<DateCursor | null>(null);
	const [newPageToFetch, setNewPageToFetch] = useState(true);
	const [loading, setLoading] = useState({
		prev: false,
		next: false,
	});

	const initialFetch = useCallback(async () => {
		try {
			const data = (await axios
				.get(`/file/recent-metadata`, {
					params: {
						limit: LIMIT,
					},
				})
				.then(res => res.data)) as RecentFileMetaData[];

			setFiles(data);
			if (data.length > 0) {
				setOldCursors([
					{
						fileName: data[data.length - 1].fileName,
						updatedAt: data[data.length - 1].updatedAt,
					},
				]);
				setNewCursor({
					fileName: data[data.length - 1].fileName,
					updatedAt: data[data.length - 1].updatedAt,
				});
			}
			if (data.length < LIMIT) setNewPageToFetch(false);
			setLoading({
				prev: false,
				next: false,
			});
		} catch (err) {
			console.log(
				"Something went wrong while getting recent files: ",
				err
			);
		}
	}, []);

	useEffect(() => {
		console.log("Useeffect triggered");
		initialFetch();
	}, [initialFetch]);

	const prevPage = async () => {
		setLoading({
			prev: true,
			next: false,
		});
		setNewPageToFetch(true);
		if (oldCursors.length <= 2) return initialFetch();

		const data = (await axios
			.get("/file/recent-metadata", {
				params: {
					limit: LIMIT,
					"cursor-updatedAt":
						oldCursors[oldCursors.length - 2].updatedAt,
					"cursor-fileName":
						oldCursors[oldCursors.length - 2].fileName,
				},
			})
			.then(res => res.data)) as RecentFileMetaData[];

		setFiles(data);
		setNewCursor(oldCursors[oldCursors.length - 1]);
		setOldCursors(oldCursors.filter((_, i) => i !== oldCursors.length - 1));
		setLoading({
			prev: false,
			next: false,
		});
	};

	const nextPage = async () => {
		if (!newPageToFetch) return;
		setLoading({
			prev: false,
			next: true,
		});
		if (!newCursor) return initialFetch();

		const data = (await axios
			.get(`/file/recent-metadata`, {
				params: {
					limit: LIMIT,
					"cursor-updatedAt": newCursor.updatedAt,
					"cursor-fileName": newCursor.fileName,
				},
			})
			.then(res => res.data)) as RecentFileMetaData[];

		if (data.length === 0) {
			return setNewPageToFetch(false);
		}

		setOldCursors(c => [...c, newCursor]);
		setFiles(data);
		setNewCursor(data.length < LIMIT ? null : data[data.length - 1]);
		if (data.length < LIMIT) setNewPageToFetch(false);
		setLoading({
			prev: false,
			next: false,
		});
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
						<Text float="left">
							{new Date(updatedAt).toLocaleString()}
						</Text>
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
