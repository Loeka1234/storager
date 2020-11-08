import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { CSSReset, ThemeProvider } from "@chakra-ui/core";
import axios from "axios";
import { API_ENDPOINT } from "./constants";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_ENDPOINT;

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <CSSReset />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
