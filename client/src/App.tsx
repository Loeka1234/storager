import React, { lazy } from "react";
import { BrowserRouter, Switch, Redirect } from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute.comp";
import { PublicRoute } from "./components/PublicRoute.comp";
import { UserProvider } from "./utils/UserContext";

const LoginPage = lazy(() => import("./pages/login.page"));
const HomePage = lazy(() => import("./pages/index.page"));
const MyStoragePage = lazy(() => import("./pages/mystorage.page"));
const RecentPage = lazy(() => import("./pages/recent.page"));

function App() {
  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Switch>
            <PrivateRoute path="/mystorage" exact useStorageLayout>
              <MyStoragePage />
            </PrivateRoute>
            <PrivateRoute path="/recent" exact useStorageLayout>
              <RecentPage />
            </PrivateRoute>
            <PrivateRoute path="/login" exact requiredToBeLoggedIn={false}>
              <LoginPage />
            </PrivateRoute>
            <PublicRoute path="/" exact>
              <HomePage />
            </PublicRoute>
            <Redirect to="/" />
          </Switch>
        </BrowserRouter>
      </UserProvider>
    </>
  );
}

export default App;
