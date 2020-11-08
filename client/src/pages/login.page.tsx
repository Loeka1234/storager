import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/core";
import React, { useContext, useState } from "react";
import axios, { AxiosError } from "axios";
import { useHistory } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { defaultErrorToastKeys } from "../utils/defaultErrorToastKeys";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setUser] = useContext(UserContext)!;
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post("/user/login", {
        username,
        password,
      });

      setLoading(false);

      history.push("/mystorage");
      setUser({ username });
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.status === 401)
        toast({
          ...defaultErrorToastKeys,
          title: "Wrong credentials",
          description: "Wrong credentials. Please try again.",
        });
      else
        toast({
          ...defaultErrorToastKeys,
          title: "Internal server error.",
          description: "An uknown error occured. Please try again.",
        });
      setLoading(false);
    }
  };

  return (
    <Flex h="100vh" w="100%" justify="center" align="center">
      <Box w={["100%", 300]} m={4}>
        <form onSubmit={handleLogin}>
          <FormControl>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              id="username"
              placeholder="username"
              onChange={(e: any) => setUsername(e.target.value)}
              value={username}
            />
          </FormControl>
          <FormControl mt={5}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              placeholder="password"
              type="password"
              onChange={(e: any) => setPassword(e.target.value)}
              value={password}
            />
          </FormControl>
          <Button mt={5} variantColor="teal" type="submit" isLoading={loading}>
            Login
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default LoginPage;
