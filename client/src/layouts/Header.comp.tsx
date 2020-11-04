import React, { useContext } from "react";
import { NAVBAR_HEIGHT } from "../constants";
import { Avatar, Button, Flex, Heading, Input, Text } from "@chakra-ui/core";
import { Link } from "react-router-dom";
import { UserContext } from "../utils/UserContext";

export interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const [user] = useContext(UserContext)!;

  if (!user) return null;

  return (
    <Flex
      w="100%"
      height={NAVBAR_HEIGHT}
      border="1px solid rgb(226, 232, 240)"
      justify="space-between"
      align="center"
    >
      <Flex align="center" w="auto">
        <Heading size="lg" ml={4}>
          Storager
        </Heading>
        <Input ml={20} minW={300} placeholder="search..." />
        <Button ml={2} px={5}>
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
