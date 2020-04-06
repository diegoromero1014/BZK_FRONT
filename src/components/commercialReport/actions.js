import _ from 'lodash';
import axios from 'axios';
import { APP_URL } from '../../constantsGlobal';
import * as constants from './constants';

export function filterUsers(filterUser) {
    const json = {
        messageHeader: {
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
            "timestamp": new Date().getTime(),
            "service": "",
            "status": "0",
            "language": "es",
            "displayErrorMessage": "",
            "technicalErrorMessage": "",
            "applicationVersion": "",
            "debug": true,
            "isSuccessful": true
        },
        messageBody: filterUser
    };
    var request = axios.post(APP_URL + "/findUsersByName", json);
    return {
        type: constants.FILTER_USER,
        payload: request
    }
}

export const clearUsers = () => ({ type: constants.CLEAR_USER });


export function addUsers(userPermission) {
    return {
        type: constants.ADD_USER,
        data: userPermission
    };
}

export function deleteUser(index, tab) {
    return {
        type: constants.DELETE_USER,
        index,
        tab
    };
}

export function setConfidential(confidential) {
    return {
        type: constants.IS_CONFIDENTIAL,
        payload: confidential
    }
}