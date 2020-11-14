import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useHistory } from "react-router-dom";
import { defaultErrorToastKeys } from "../utils/defaultErrorToastKeys";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await axios.post("/user/register", {
        username,
        password,
        key: accessToken,
      });

      if (res.status !== 200) throw new Error();

      setLoading(false);
      history.push("/login"); // TODO: Login at register
    } catch (e) {
      setLoading(false);
      const err = e as AxiosError;

      if (err.response?.status === 409)
        toast({
          ...defaultErrorToastKeys,
          title: "User already exists",
          description:
            "Oh it looks like this user already exists. Please choose a different username.",
        });
      else if (err.response?.status === 401)
        toast({
          ...defaultErrorToastKeys,
          title: "Invalid access token.",
          description:
            "The access token you entered is invalid. Please try again.",
        });
      else
        toast({
          ...defaultErrorToastKeys,
          title: "Internal server error",
          description: "An unknown error has occured. Please try again.",
        });
    }
  };

  return (
    <Flex h="100vh" w="100%" justify="center" align="center">
      <Box w={["100%", 300]} m={4}>
        <form onSubmit={handleRegister}>
          <FormControl>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              isRequired
              id="username"
              placeholder="username"
              onChange={(e: any) => setUsername(e.target.value)}
              value={username}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              isRequired
              id="password"
              placeholder="password"
              type="password"
              onChange={(e: any) => setPassword(e.target.value)}
              value={password}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="accessToken">Access Token</FormLabel>
            <Input
              isRequired
              id="accessToken"
              placeholder="access token"
              onChange={(e: any) => setAccessToken(e.target.value)}
              value={accessToken}
            />
          </FormControl>
          <Button type="submit" colorScheme="teal" mt={2} isLoading={loading}>
            Register
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default RegisterPage;
