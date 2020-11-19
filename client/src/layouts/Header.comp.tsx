import React, { useContext, useRef, useState } from "react";
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
import { useHistory } from "react-router-dom";
import { defaultErrorToastKeys } from "../utils/defaultErrorToastKeys";

export interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const [user] = useContext(UserContext)!.user;
  const { logout } = useContext(UserContext)!;
  const [searchString, setSearchString] = useState("");
  const history = useHistory();
  const searchInput = useRef<HTMLInputElement | null>(null);
  const toast = useToast();

  if (!user) return null;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchString.length >= 5) {
      history.push(`/search?s=${searchString}`);
      setSearchString("");
      searchInput.current?.blur();
    } else
      toast({
        ...defaultErrorToastKeys,
        title: "Search error",
        description: "Your search input should be longer then 4 characters.",
      });
  };

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
        <form
          style={{ display: "flex", alignContent: "center" }}
          onSubmit={handleSearch}
        >
          <Input
            maxW={300}
            placeholder="search..."
            value={searchString}
            onChange={e => setSearchString(e.target.value)}
            ref={searchInput}
          />
          <Button px={5} ml={2} type="submit">
            Search
          </Button>
        </form>
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
