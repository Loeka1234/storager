import React, { lazy, Suspense } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute.comp";
import { UserProvider } from "./utils/UserContext";

const LoginPage = lazy(() => import("./pages/login.page"));
const HomePage = lazy(() => import("./pages/index.page"));
const MyStoragePage = lazy(() => import("./pages/mystorage.page"));

function App() {
  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Suspense fallback="Loading...">
            <Switch>
              <PrivateRoute path="/mystorage" exact>
                <MyStoragePage />
              </PrivateRoute>
              <PrivateRoute path="/login" exact requiredToBeLoggedIn={false}>
                <LoginPage />
              </PrivateRoute>
              <Route path="/" exact>
                <HomePage />
              </Route>
              <Redirect to="/" />
            </Switch>
          </Suspense>
        </BrowserRouter>
      </UserProvider>
    </>
  );
}

export default App;
