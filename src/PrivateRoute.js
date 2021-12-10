import React from "react";
import { Route, Redirect } from "react-router-dom";
import { checkAuth, checkLiveLink } from "./myJs";

const PrivateRoute = ({
  component: Component,
  ...rest
}) => {
  return (
    <Route
        {...rest}
      render={props =>
        checkAuth() ? (
            window.location.pathname === (checkLiveLink() ? "/moshmatch/chat" : "/chat") ?
          <Component {...props} />
          :
          <Redirect
      to="/chat"
    />
        ) : (
          <Redirect
      to="/login"
    />
        )
      }
    />

  );
};

export default PrivateRoute;

