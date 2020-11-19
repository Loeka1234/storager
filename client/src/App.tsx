import React, { lazy } from "react";
import { BrowserRouter, Switch, Redirect } from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute.comp";
import { PublicRoute } from "./components/PublicRoute.comp";
import "./global.css";
import { Providers } from "./contexts/Providers.comp";

const LoginPage = lazy(() => import("./pages/login.page"));
const RegisterPage = lazy(() => import("./pages/register.page"));
const HomePage = lazy(() => import("./pages/index.page"));
const MyStoragePage = lazy(() => import("./pages/mystorage.page"));
const RecentPage = lazy(() => import("./pages/recent.page"));
const SearchPage = lazy(() => import("./pages/search.page"));

function App() {
  return (
    <>
      <Providers>
        <BrowserRouter>
          <Switch>
            <PrivateRoute path="/search" exact useStorageLayout>
              <SearchPage />
            </PrivateRoute>
            <PrivateRoute path="/mystorage" exact useStorageLayout>
              <MyStoragePage />
            </PrivateRoute>
            <PrivateRoute path="/recent" exact useStorageLayout>
              <RecentPage />
            </PrivateRoute>
            <PrivateRoute path="/login" exact requiredToBeLoggedIn={false}>
              <LoginPage />
            </PrivateRoute>
            <PrivateRoute path="/register" exact requiredToBeLoggedIn={false}>
              <RegisterPage />
            </PrivateRoute>
            <PublicRoute path="/" exact>
              <HomePage />
            </PublicRoute>
            <Redirect to="/" />
          </Switch>
        </BrowserRouter>
      </Providers>
    </>
  );
}

export default App;
