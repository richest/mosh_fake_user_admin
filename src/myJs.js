import React, { useEffect } from 'react';
import io from 'socket.io-client'

export const SOCKET = io('https://moshmatch.com:444/', {
});

export const baseUrl = () => {
    // return "https://moshmatch.com/apprich/api"
    return "https://moshmatch.com/moshclone/moshapp/api"
}

// Common function toggle
export default function useToggle(initialValue = false) {
    const [value,
        setValue] = React.useState(initialValue);
    const toggle = React.useCallback(() => {
        setValue(v => !v);
    }, []);
    return [value, toggle];
}

export function addBodyClass(className) {
    return () => useEffect(() => {
        document.body.className = className;
        return () => {
            document.body.className = 'no-bg';
        }
    });

}

export function setStorage(key, value) {
    return localStorage.setItem(key, value);
}

export function removeStorage(key) {
    return localStorage.removeItem(key);
}

export function randomString(len = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

export const addDefaultSrc = (ev) => {
    ev.target.src = '/moshmatch/assets/images/image-placeholder.jpg'
}

export const returnDefaultImage = (ev) => {
    return '/moshmatch/assets/images/image-placeholder.jpg'
}

export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export const checkAuth = () => {
    const session = getCookie("session_id");
    const user_id = Number(getCookie("user_id"));
    const f_name = getCookie("f_name");
    const l_name = getCookie("l_name");
    const email = getCookie("email");
    if (!!session && (user_id !== null && user_id !== undefined) && !!f_name && !!l_name && !!email) {
        return true
    }
    else {
        return false
    }
}

export const clearCookies = () => {
    document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
}

export const checkLiveLink = () => {
    if (window.location.hostname === "moshmatch.com") {
        return true
    }
    return false
}

export const removeDublicateFrd = (chatList) => {
    chatList.forEach((data_outer, i) => {
        let count = 0;
        chatList.forEach((data_inner, j) => {
            if (data_inner.user_id == data_outer.user_id) {
                count += 1;
                if (count > 1) {
                    chatList.splice(j, 1)
                }
            }
        })
    })
    return chatList
}