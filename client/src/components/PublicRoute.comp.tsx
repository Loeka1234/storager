import React, { Suspense } from "react";
import { Route, RouteProps } from "react-router-dom";

type PublicRouteProps = RouteProps & {};

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={() => <Suspense fallback="Loading...">{children}</Suspense>}
    />
  );
};
