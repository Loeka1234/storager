import React, { useContext, useState } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { UserContext } from "../utils/UserContext";

type PrivateRouteProps = RouteProps & {
  requiredToBeLoggedIn?: boolean;
};

// If requiredToBeLoggedIn is true: the user needs te be logged in
// Else: the user must not be logged in
export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requiredToBeLoggedIn = true,
  ...rest
}) => {
  const [user] = useContext(UserContext)!;

  return (
    <Route
      {...rest}
      render={({ location }) =>
        (requiredToBeLoggedIn && user) || (!requiredToBeLoggedIn && !user) ? (
          children
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
