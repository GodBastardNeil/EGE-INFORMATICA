import {$host, $authHost} from "./index";
import jwt_decode from "jwt-decode";

export const registration = async (login, password, roleId) => {
    const {data} = await $host.post('api/user/registration', {login, password, roleId});
    localStorage.setItem('token', data.token);
    return jwt_decode(data.token);
}

export const login = async (login, password, roleId) => {
    const {data} = await $host.post('api/user/login', {login, password, roleId});
    localStorage.setItem('token', data.token);
    return jwt_decode(data.token);
}


export const getRoles = async () => {
    const {data} = await $host.get('api/user/role'); // {id, name}
    return data;
}


export const check = async () => {
    const {data} = await $authHost.get('api/user/auth'); // {login, password, roleId}
    localStorage.setItem('token', data.token);
    return jwt_decode(data.token);
}

export const logout = async () =>  {
    localStorage.removeItem('token');
    console.log('logout');
}