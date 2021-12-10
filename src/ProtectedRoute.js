import React from "react";
import { Route, Redirect } from "react-router-dom";
import { checkAuth, checkLiveLink } from "./myJs";

const ProtectedRoute = ({
  component: Component,
  ...rest
}) => {
  return (
    <Route
        {...rest}
      render={props =>
        !checkAuth() ? (
            window.location.pathname === (checkLiveLink() ? "/moshmatch/login" : "/login") ?
            <Component {...props} />
            :
            <Redirect
      to="/login"
    />
        ) : (
          <Redirect
      to="/chat"
    />
        )
      }
    />

  );
};



export default ProtectedRoute;

