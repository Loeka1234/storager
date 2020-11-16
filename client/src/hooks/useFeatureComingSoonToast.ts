import { createStandaloneToast } from "@chakra-ui/react";

const toast = createStandaloneToast();

export const featureComingSoonToast = () => {
  toast({
    title: "Feature coming soon!",
    description: "This feature is still work in progress.",
    duration: 9000,
    isClosable: true,
    position: "bottom",
    status: "error",
  });
};
