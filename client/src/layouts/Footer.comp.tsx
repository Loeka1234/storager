import { Flex, Heading, Icon, Link } from "@chakra-ui/react";
import React from "react";
import { MdStorage } from "react-icons/md";
import { BORDER_STYLE, FOOTER_HEIGHT, FOOTER_MARGIN_TOP } from "../constants";

export const Footer: React.FC = () => {
  return (
    <Flex
      w="100%"
      justify="center"
      align="center"
      flexDir="column"
      h={FOOTER_HEIGHT}
      backgroundColor="teal.400"
      mt={`${FOOTER_MARGIN_TOP}px`}
      borderTop={BORDER_STYLE}
      position="relative"
    >
      <Icon
        as={MdStorage}
        color="teal.600"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        boxSize="60px"
      />
      <Heading
        as="h4"
        fontWeight={600}
        fontSize={20}
        color="white"
        zIndex={1}
        lineHeight={0.4}
      >
        ©
      </Heading>
      <Link
        href="https://www.loeka.me"
        fontWeight={600}
        fontSize={20}
        color="white"
        zIndex={1}
        target="_blank"
        rel="noopener"
      >
        Loeka Lievens
      </Link>
    </Flex>
  );
};
