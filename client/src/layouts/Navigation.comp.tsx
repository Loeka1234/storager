import {
	Box,
	Button,
	Flex,
	Menu,
	MenuButton,
	MenuDivider,
	MenuGroup,
	MenuItem,
	MenuList,
	Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { BORDER_STYLE, NAVIGATION_WIDTH } from "../constants";
import {
	AiOutlineFolderAdd,
	AiOutlineFileAdd,
	AiOutlineClockCircle,
} from "react-icons/ai";
import { MdStorage } from "react-icons/md";
import { IconType } from "react-icons/lib";
import { useHistory } from "react-router-dom";
import { FileUploader } from "../components/FileUploader/FileUploader.comp";
import { UsedStorage } from "../components/UsedStorage.comp";
import { AddIcon } from "@chakra-ui/icons";

export interface NavigationProps {}

export const Navigation: React.FC<NavigationProps> = () => {
	const [openFileUploader, setOpenFileUploader] = useState(false);

	const handleClose = () => {
		setOpenFileUploader(false);
	};

	return (
		<>
			<FileUploader isOpen={openFileUploader} handleClose={handleClose} />
			<Flex
				align="flex-start"
				justify="flex-start"
				flexDir="column"
				borderRight={BORDER_STYLE}
				minW={NAVIGATION_WIDTH}
			>
				<Menu>
					<MenuButton as={Button} borderRadius={5} mt={4} ml={4}>
						<AddIcon mr={2} color="teal.500" />
						New
					</MenuButton>
					<MenuList placement="bottom">
						<MenuGroup title="Add">
							<MenuItem>
								<Box
									as={AiOutlineFolderAdd}
									boxSize="22px"
									mr={1}
									color="teal.500"
								/>
								Directory
							</MenuItem>
						</MenuGroup>
						<MenuDivider />
						<MenuGroup title="Upload">
							<MenuItem onClick={() => setOpenFileUploader(true)}>
								<Box
									as={AiOutlineFileAdd}
									boxSize="22px"
									mr={1}
									color="teal.500"
								/>
								File
							</MenuItem>
							<MenuItem>
								<Box
									as={AiOutlineFolderAdd}
									boxSize="22px"
									mr={1}
									color="teal.500"
								/>
								Directory
							</MenuItem>
						</MenuGroup>
					</MenuList>
				</Menu>

				<Flex w="100%" as="nav" flexDir="column" mt={2}>
					<NavItem
						icon={MdStorage}
						text="My Storage"
						url="/mystorage"
					/>
					<NavItem
						icon={AiOutlineClockCircle}
						text="Recent"
						url="/recent"
					/>
				</Flex>

				<UsedStorage />
			</Flex>
		</>
	);
};

const NavItem: React.FC<{
	icon: IconType;
	url: string;
	text: string;
}> = ({ url, icon, text }) => {
	const history = useHistory();

	return (
		<Link to={url}>
			<Flex
				_hover={{ bg: "gray.200" }}
				transition="all .3s ease-in-out"
				align="center"
				h="40px"
				position="relative"
			>
				{history.location.pathname === url && (
					<Box
						position="absolute"
						left={0}
						top={0}
						bottom={0}
						w={1}
						backgroundColor="teal.400"
					/>
				)}
				<Box as={icon} boxSize="32px" ml={4} mr={2} />
				<Text
					color={
						history.location.pathname === url
							? "teal.400"
							: "gray.900"
					}
				>
					{text}
				</Text>
			</Flex>
		</Link>
	);
};
