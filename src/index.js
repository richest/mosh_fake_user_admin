import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import store from './store';
import Login from './Login';
import { checkAuth, checkLiveLink, getCookie } from './myJs';
import ProtectedRoute from './ProtectedRoute';
import PrivateRoute from './PrivateRoute';

ReactDOM.render(
  <Provider store={store}>
  <BrowserRouter>
    <Switch>
       <ProtectedRoute path="/login" component={Login} />
      <PrivateRoute path="/chat" component={App} /> 
      {
        !window.location.pathname === (checkLiveLink() ? "/moshmatch/login" : "/login") && !window.location.pathname === (checkLiveLink() ? "/moshmatch/chat" : "/chat") &&
        checkAuth() ?
        <Redirect
        to="/chat"
      />
      :
      <Redirect
      to="/login"
    />
      }
    </Switch>
   </BrowserRouter>
 </Provider>,
  document.getElementById('root')

);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
