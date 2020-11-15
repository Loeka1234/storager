import React, { Suspense, useContext } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { StorageLayout } from "../layouts/StorageLayout.comp";
import { UserContext } from "../contexts/UserContext";

type PrivateRouteProps = RouteProps & {
  requiredToBeLoggedIn?: boolean;
  useStorageLayout?: boolean;
};

// If requiredToBeLoggedIn is true: the user needs te be logged in
// Else: the user must not be logged in
export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requiredToBeLoggedIn = true,
  useStorageLayout = false,
  ...rest
}) => {
  const [user] = useContext(UserContext)!.user;

  let Comp: any;
  if (useStorageLayout) Comp = StorageLayout;
  else Comp = React.Fragment;

  return (
    <Route
      {...rest}
      render={({ location }) =>
        (requiredToBeLoggedIn && user) || (!requiredToBeLoggedIn && !user) ? (
          <Comp>
            <Suspense fallback="Loading...">{children}</Suspense>
          </Comp>
        ) : (
          <Redirect
            to={{
              pathname: requiredToBeLoggedIn ? "/login" : "/mystorage",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
