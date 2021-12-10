import React, { useState, useEffect } from "react";
import  $, { data } from 'jquery';
import {useSelector, useDispatch} from 'react-redux';
import axios from "axios";
import {baseUrl, checkAuth, getCookie, setCookie, SOCKET} from './myJs';
import { v4 as uuidv4 } from 'uuid';
import { css } from "@emotion/core";
import BarLoader from "react-spinners/BarLoader";   
import Logo from './component/Logo';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import useToggle from './myJs';     
import { useHistory } from "react-router-dom";
import {addDefaultSrc, returnDefaultImage} from "./myJs";

const Login = (props) =>{
    const dispatch = useDispatch();
    const history = useHistory();
    const is_auth = checkAuth();
    const[formState, setFormState] = useState({email: "", password: ""});
    const[loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const bodyParameters = {
            email: formState.email,
            password: formState.password,
            device_type: 1,
            device_token: "5636363546534654",
            latitude: 30.7046,
            longitude: 76.7179
        }
        try{
            const login= await axios.post(baseUrl() + "/login", bodyParameters)
            setLoading(false);
            if (login.data.success && (login.data.status === 200)) {
               setCookie("session_id", login.data.profile.session_id, 1);
               setCookie("user_id", login.data.profile.id, 1);
               setCookie("f_name", login.data.profile.first_name, 1);
               setCookie("l_name", login.data.profile.last_name, 1);
               setCookie("email", login.data.profile.email, 1);
                history.push("/chat")
            }
            else{
                alert(login.data.message)
            }
        }
        catch (err) {
            setLoading(false);
            alert("Something went wrong !!")
        }
    }

    useEffect(() => {
        document.title = "Mosh | Login"
        if(is_auth) {
            history.push("/chat")
          }
    }, [])
    return(
        <div class="login-page">
            <img className="bg-mask" src="/moshmatch/assets/images/mask-bg.png" alt="Mask" />
        <div class="login-box w-100">
          <div class="login-logo">
          <a href="javascript:void(0);" style={{cursor: "default"}}>
                    <img src="/moshmatch/assets/images/mosh.png" alt="Mosh" />
          </a>
          </div>
          
          <div className="container">
              <div className="row">
                  <div className="col-md-6 mx-auto">
                  <div class="card p-5">
            <div class="card-body login-card-body p-0">
              <h5 class="login-box-msg mb-3 text-white">Sign in to start your session</h5>
        
              <form onSubmit={(e) => handleSubmit(e)}>
                <div class="input-group mb-3">
                  <input required={true} type="email" class="form-control" onChange={(e) => setFormState({...formState, ...{email: e.target.value}})} value={formState.email} name="email" placeholder="Email"/>
                  <input type="hidden" name="_token" value="uO90M1nIHOq2SoKfmKb5ZwgguW2S8oNVsTagLihI"/>
                  <div class="input-group-append">
                    <div class="input-group-text bg-grd-clr">
                      <span class="fas fa-envelope text-white"></span>
                    </div>
                  </div>
                </div>
                <div class="input-group mb-3">
                  <input required={true} type="password" class="form-control" onChange={(e) => setFormState({...formState, ...{password: e.target.value}})} value={formState.password} name="password" placeholder="Password"/>
                  <div class="input-group-append">
                    <div class="input-group-text bg-grd-clr">
                      <span class="fas fa-lock text-white"></span>
                    </div>
                  </div>
                </div>
                <div class="row">
                  
                  <div class="col-12">
                    <button type="submit" disabled={loading ? true : false} class="btn btn-primary btn-block">Sign In</button>
                  </div>
                  </div>
              </form>
              </div>
              </div>
                  </div>
              </div>
          </div>
         
              </div>
        </div>
    )
}
export default Login;