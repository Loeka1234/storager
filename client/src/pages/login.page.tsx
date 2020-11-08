import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/core";
import React, { useContext, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../constants";
import { useHistory } from "react-router-dom";
import { UserContext } from "../utils/UserContext";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setUser] = useContext(UserContext)!;
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        API_ENDPOINT + "/user/login",
        {
          username,
          password,
        },
        {
          withCredentials: true, // TODO: global withcredentials
        }
      );

      setUser({ username });

      history.push("/mystorage");
      setLoading(false);
    } catch (err) {
      console.error("Error while logging in: ", err);
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
