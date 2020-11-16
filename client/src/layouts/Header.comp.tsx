import React, { useContext } from "react";
import { BORDER_STYLE, NAVBAR_HEIGHT, NAVIGATION_WIDTH } from "../constants";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
	useToast,
} from "@chakra-ui/react";
import { UserContext } from "../contexts/UserContext";
import { CgLogOut } from "react-icons/cg";
import { MdAccountCircle } from "react-icons/md";
import { featureComingSoonToast } from "../hooks/useFeatureComingSoonToast";

export interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const [user] = useContext(UserContext)!.user;
	const { logout } = useContext(UserContext)!;

  if (!user) return null;

  return (
    <Flex
      w="100%"
      height={`${NAVBAR_HEIGHT}px`}
      border={BORDER_STYLE}
      justify="space-between"
      align="center"
    >
      <Flex align="center" flexGrow={1} justify="flex-start">
        <Box minW={NAVIGATION_WIDTH}>
          <Heading fontSize="2xl" pl={2}>
            Storager
          </Heading>
        </Box>
        <Input maxW={300} placeholder="search..." />
        <Button px={5} ml={2}>
          Search
        </Button>
      </Flex>
      <Flex align="center">
        <Text fontSize="xl">{user.username}</Text>
        <Menu>
          <MenuButton>
            <Avatar name={user.username} ml={2} mr={4} />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={featureComingSoonToast}>
              <Icon as={MdAccountCircle} boxSize="30px" />
              <Text ml={2}>My account</Text>
            </MenuItem>
            <MenuItem onClick={logout}>
              <Icon as={CgLogOut} boxSize="30px" />
              <Text ml={1}>Logout</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};
