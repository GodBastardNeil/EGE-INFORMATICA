import {$host, $authHost} from "./index";
import jwt_decode from "jwt-decode";

export const getTest = async (id) => {
    console.log(id);
    const {data} = await $authHost.get('api/test/' + id);
    return data;
}
export const getTestStat = async (testId, studentId) => {
    console.log(testId, studentId);
    const {data} = await $authHost.get(`api/test/${testId}/${studentId}`);
    return data;
}

export const setTest = async (ans, score, testId) => {
    let id = jwt_decode(localStorage.getItem('token')).id;
    await $authHost.post('api/test/', {id, ans, score, testId});
}