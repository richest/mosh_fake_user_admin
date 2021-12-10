import React from 'react'
import ReactDOM from "react-dom";
import { Link } from 'react-router-dom';
import {addDefaultSrc} from "../myJs";
const Logo = () =>{
    return (
          <a href="javascript:void(0);" style={{cursor: "default"}}>
                    <img src="/moshmatch/assets/images/mosh.png" alt="Mosh" />
          </a>
    )
}

export default Logo;