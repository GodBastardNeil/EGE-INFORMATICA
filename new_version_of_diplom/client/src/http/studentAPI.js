import {$host, $authHost} from "./index";
import jwt_decode from "jwt-decode";

export const getMainStat = async (id) => {
    const {data} = await $authHost.get('api/student/main/' + id);
    return data;
}
export const getTestStat = async (id) => {
    const {data} = await $authHost.get('api/student/test/' + id); // {id, task_score, mas_score, user_scores, dates}
    return data;
}
export const getTeacherTests = async (id) => {
    const {data} = await $authHost.get('api/student/teach/' + id); // {id, task_score, mas_score, user_scores, dates}
    return data;
}
export const getTopicStat = async (id) => {
    const {data} = await $authHost.get('api/student/topic/' + id); // {topicId, user_score, max_score, last_5}
    return data;
}