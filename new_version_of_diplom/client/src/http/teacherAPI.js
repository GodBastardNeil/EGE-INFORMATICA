import {$host, $authHost} from "./index";
import jwt_decode from "jwt-decode";

export const getStudents = async () => {
    let id = jwt_decode(localStorage.getItem('token')).id;
    console.log(id);
    const {data} = await $authHost.get('api/teacher/statinfo/'+id); // {id, login}
    return data;
}