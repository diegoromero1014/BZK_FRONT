export const CONSULT_BLACK_LIST_CLIENT = "CONSULT_BLACK_LIST_CLIENT";
export const UPDATE_VALUES_BLACKLIST = "UPDATE_VALUES_BLACKLIST";
import {APP_URL} from '../../../constantsGlobal';
import axios from 'axios';

export function consultStateBlackListClient(jsonLinkEntityClient){
    const jsonComplete = {
        messageHeader: {
            "timestamp": new Date().getTime(),
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
            "service": "",
            "status": "0",
            "language": "es",
            "displayErrorMessage": "",
            "technicalErrorMessage": "",
            "applicationVersion": "",
            "debug": true,
            "isSuccessful": true
        },
        messageBody: jsonLinkEntityClient
    };
    const request = axios.post(APP_URL + "/client/check-client-on-control-list", jsonComplete);
    return {
        type: CONSULT_BLACK_LIST_CLIENT,
        payload: request
    }
}

export function updateValuesBlackList(level, message){
    return {
        type: UPDATE_VALUES_BLACKLIST,
        level,
        message
    }
}