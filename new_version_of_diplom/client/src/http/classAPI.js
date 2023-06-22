import {$host, $authHost} from "./index";
import jwt_decode from "jwt-decode";

export const getTeachers = async () => {
    let id = jwt_decode(localStorage.getItem('token')).id;
    const {data} = await $authHost.get('api/class/teachers/' + id);
    return data;
}
export const getStudents = async () => {
    let id = jwt_decode(localStorage.getItem('token')).id;
    const {data} = await $authHost.get('api/class/students/'+id);
    return data;
}


export const delete_from_class = async (id, rowKey) => {
    console.log('delete_from_class', id, rowKey);
    await $authHost.post('api/class/deleteclass', {id, rowKey});
}

export const add_to_request = async (id, rowKey) => {
    console.log('add_to_request', id, rowKey);
    await $authHost.post('api/class/addrequest', {id, rowKey});
}

export const add_to_class = async (id, rowKey) => {
    console.log('add_to_class', id, rowKey);
    await $authHost.post('api/class/addclass', {id, rowKey});
}