import React, { useContext } from "react";
import { BORDER_STYLE, NAVBAR_HEIGHT, NAVIGATION_WIDTH } from "../constants";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
} from "@chakra-ui/core";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

export interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const [user] = useContext(UserContext)!;

  if (!user) return null;

  return (
    <Flex
      w="100%"
      height={NAVBAR_HEIGHT}
      border={BORDER_STYLE}
      justify="space-between"
      align="center"
    >
      <Flex align="center" flexGrow={1} justify="flex-start">
        <Box w={NAVIGATION_WIDTH}>
          <Heading size="lg" pl={2}>
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
        <Link to="/profile">
          <Avatar as="button" name={user.username} ml={2} mr={4} />
        </Link>
      </Flex>
    </Flex>
  );
};
