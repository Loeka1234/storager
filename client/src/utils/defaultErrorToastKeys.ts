import { useToastOptions } from "@chakra-ui/core";

export const defaultErrorToastKeys = {
  status: "error",
  duration: 9000,
  isClosable: true,
} as Partial<useToastOptions>;