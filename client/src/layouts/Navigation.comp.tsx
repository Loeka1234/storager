import {
  Box,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  PseudoBox,
  Text,
} from "@chakra-ui/core";
import { Link, useRouteMatch } from "react-router-dom";
import React, { useEffect } from "react";
import { BORDER_STYLE, NAVIGATION_WIDTH } from "../constants";
import {
  AiOutlineFolderAdd,
  AiOutlineFileAdd,
  AiOutlineClockCircle,
} from "react-icons/ai";
import { MdStorage } from "react-icons/md";
import { IconType } from "react-icons/lib";
import { useHistory } from "react-router-dom";

export interface NavigationProps {}

export const Navigation: React.FC<NavigationProps> = () => {
  return (
    <Flex
      align="flex-start"
      justify="flex-start"
      flexDir="column"
      borderRight={BORDER_STYLE}
      w={NAVIGATION_WIDTH}
    >
      <Menu>
        <MenuButton as={Button} borderRadius={5} mt={4} ml={4}>
          <Icon name="add" mr={2} color="teal.500" />
          New
        </MenuButton>
        <MenuList placement="bottom">
          <MenuGroup title="Add">
            <MenuItem>
              <Box
                as={AiOutlineFolderAdd}
                size="22px"
                mr={1}
                color="teal.500"
              />
              Directory
            </MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup title="Upload">
            <MenuItem>
              <Box as={AiOutlineFileAdd} size="22px" mr={1} color="teal.500" />
              File
            </MenuItem>
            <MenuItem>
              <Box
                as={AiOutlineFolderAdd}
                size="22px"
                mr={1}
                color="teal.500"
              />
              Directory
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>

      <Flex w="100%" as="nav" flexDir="column" mt={2}>
        <NavItem icon={MdStorage} text="My Storage" url="/mystorage" />
        <NavItem icon={AiOutlineClockCircle} text="Recent" url="/recent" />
      </Flex>
    </Flex>
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
      <PseudoBox _hover={{ bg: "gray.200" }} transition="all .3s ease-in-out">
        <Flex align="center" h="40px" position="relative">
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
          <Box as={icon} size="32px" ml={4} mr={2} />
          <Text
            color={history.location.pathname === url ? "teal.400" : "gray.900"}
          >
            {text}
          </Text>
        </Flex>
      </PseudoBox>
    </Link>
  );
};
