import { APP_URL } from '../../constantsGlobal';
import { VALIDATE_LOGIN, CHANGE_STATUS_LOGIN, CLEAR_STATE } from './constants';
import { INIT_INPUT_EVENTS, STOP_INPUT_EVENTS, APP_NAME } from '../../constantsGlobal';
import axios from 'axios';
import momentTimeZone from 'moment-timezone';

import { setAuthorizationHeader } from '../../api';

export function validateLogin(username, password, recaptcha) {

    const json = {
        messageHeader: {
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
        messageBody: {
            "username": username,
            "password": password,
            "recaptcha": recaptcha,
            "application": APP_NAME,
            "timeZone": momentTimeZone.tz.guess()
        }
    };
    const request = axios.post(APP_URL + "/userAuthentication", json, {
        withCredentials: true,        
    });
    return {
        type: VALIDATE_LOGIN,
        payload: request
    }
}

export function saveSessionToken(sessionToken) {
    setAuthorizationHeader(sessionToken);
    window.localStorage.setItem('sessionTokenFront', sessionToken);
    return {
        type: CHANGE_STATUS_LOGIN,
        payload: ""
    }
}

export function saveSessionUserName(userName, name) {
    window.localStorage.setItem('userNameFront', userName);
    window.localStorage.setItem('name', name);
}

export function clearSessionUserName() {
    window.sessionStorage.clear();
}
export function clearStateLogin() {
    return {
        type: CLEAR_STATE,
        payload: ""
    }
}

export function loadObservablesLeftTimer() {
    return {
        type: INIT_INPUT_EVENTS
    }
}

export function stopObservablesLeftTimer() {
    return {
        type: STOP_INPUT_EVENTS
    }
}
