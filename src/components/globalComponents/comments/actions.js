import axios from 'axios';
import {CREATE_COMMENT, ADD_COMMENT_LIST, CLEAR_COMMENTS, GET_COMMENTS_BY_TASK_ID} from "./constants";
import {APP_URL} from "../../../constantsGlobal";

export function getCommentsByTaskId(id){
    const json = {
        messageHeader: {
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
        },
        messageBody: id
    }
    const request = axios.post(APP_URL + "/getCommentsByTaskId", json);
    return {
        type: GET_COMMENTS_BY_TASK_ID,
        payload: request
    };
}

export function createComment(json){
    const request = axios.post(APP_URL + "/saveComment", json);
    return {
        type: CREATE_COMMENT,
        payload: request
    };
}

export function addCommentToList(comment){
    return {
        type: ADD_COMMENT_LIST,
        payload: {
            comment
        }
    }
}

export function clearComments(){
    return {
        type: CLEAR_COMMENTS
    };
}