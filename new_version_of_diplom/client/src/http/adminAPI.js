import {$host, $authHost} from "./index";
import jwt_decode from "jwt-decode";

export const fetchTopic = async () => {
    const {data} = await $authHost.get('api/admin/topic');
    return data;
}
export const fetchType = async (id) => {
    const {data} = await $authHost.get('api/admin/type/' + id);
    return data;
}
export const fetchTemplate = async (id) => {
    const {data} = await $authHost.get('api/admin/template/' + id);
    return data;
}
export const getTopicId = async (id) => {
    const {data} = await $authHost.get('api/admin/template/topicId/' + id);
    return data;
}

export const Reset = async (id) => {
    await $authHost.post('api/admin/topic/' + id);
}

export const SaveTopic = async (id, title) => {
    try {
        await $authHost.post('api/admin/SaveTopic', { id, title });
        return true;
    } catch (error) { return false; }
}
export const SaveType = async (id, topicId, title) => {
    try {
        await $authHost.post('api/admin/SaveType', { id, topicId, title });
        return true;
    } catch (error) { return false; }
}

export const ChangeTopic = async (id, title) => {
    try {
        await $authHost.post('api/admin/ChangeTopic', { id, title });
        return true;
    } catch (error) { return false; }
}
export const ChangeType = async (id, title) => {
    try {
        await $authHost.post('api/admin/ChangeType', { id, title });
        return true;
    } catch (error) { return false; }
}

export const ActiveTopic = async (id, active) => {
    try {
        await $authHost.post('api/admin/ActiveTopic', { id, active });
        return true;
    } catch (error) { return false; }
}
export const ActiveType = async (id, active) => {
    try {
        await $authHost.post('api/admin/ActiveType', { id, active }).then(data => { return true; });
    } catch (error) { return false; }
}
export const ActiveTemplate = async (id, active) => {
    try {
        await $authHost.post('api/admin/ActiveTemplate', { id, active }).then(data => { return true; });
    } catch (error) { return false; }
}