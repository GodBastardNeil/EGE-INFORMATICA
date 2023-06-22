import {$host, $authHost} from "./index";
import jwt_decode from "jwt-decode";

export const fetchTopic = async () => {
    const {data} = await $authHost.get('api/topic');
    return data;
}

/**/
export const createTest = async (studlist) => {
    let id = jwt_decode(localStorage.getItem('token')).id;
    const {data} = await $authHost.post('api/topic/blank', { id, studlist });
    console.log(data);
    
    return data;
}
export const createTestEx = async (testid, typeid, kol) => {
    await $authHost.post('api/topic', { testid, typeid, kol });
}