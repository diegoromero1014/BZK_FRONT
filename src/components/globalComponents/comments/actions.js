import axios from 'axios';
import {ADD_COMMENT_LIST, CLEAR_COMMENTS, GET_COMMENTS_BY_REPORT_ID, GET_CURRENT_COMMENTS_LIST} from "./constants";
import {APP_URL} from "../../../constantsGlobal";

export function getCommentsByReportId(reportId, reportType){
    const json = {
        messageHeader: {
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
        },
        messageBody: {
            reportId,
            reportType
        }
    }
    const request = axios.post(APP_URL + "/getCommentsByTaskId", json);
    return {
        type: GET_COMMENTS_BY_REPORT_ID,
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

export function getCurrentComments(){
    return {
        type: GET_CURRENT_COMMENTS_LIST
    };
}