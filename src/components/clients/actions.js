import { APP_URL } from '../../constantsGlobal';
import {
    CLIENTS_FIND, CHANGE_PAGE, CHANGE_KEYWORD, CLEAR_CLIENTS, GET_RECENT_CLIENTS,
    DELETE_ALL_RECENT_CLIENTS, DELETE_RECENT_CLIENT, CLIENTS_FIND_TYPE_NUMBER_BASIC, SAVE_FILTER, BACK_BUTTON_FILTER, CLEAR_SAVE_FILTER
} from './constants';
import axios from 'axios';

export function clientsFindServer(keyword, limInf, limSup, certificationStatus, teamId, bussinesRol, management, decisionCenter, levelAEC) {
    const json = {
        "messageHeader": {
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
        "messageBody": {
            "keyword": keyword,
            "limInf": limInf,
            "limSup": limSup,
            "certificationStatus": certificationStatus,
            "teamId": teamId,
            "bussinesRol": bussinesRol,
            "management": management,
            "decisionCenter": decisionCenter,
            "levelAEC": levelAEC
        }
    };

    const request = axios.post(APP_URL + "/clientListForEmployee", json);
    return {
        type: CLIENTS_FIND,
        payload: request
    }
}

export function changePage(page) {
    return {
        type: CHANGE_PAGE,
        currentPage: page
    }
}

export function changeKeyword(keyword) {
    return {
        type: CHANGE_KEYWORD,
        keyword: keyword
    }
}

export function clearClients() {
    return {
        type: CLEAR_CLIENTS
    }
}

export function getRecentClients() {
    const json = {
        "messageHeader": {
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
        "messageBody": null
    };

    const request = axios.post(APP_URL + "/getRecentClients", json);
    return {
        type: GET_RECENT_CLIENTS,
        payload: request
    }
}

export function deleteAllRecentClients() {
    const json = {
        "messageHeader": {
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
        "messageBody": null
    };

    const request = axios.post(APP_URL + "/deleteAllRecentClients", json);
    return {
        type: DELETE_ALL_RECENT_CLIENTS,
        payload: request
    }
}

export function deleteRecentClient(idClient) {
    const json = {
        "messageHeader": {
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
        "messageBody": idClient
    };

    const request = axios.post(APP_URL + "/deleteRecentClient", json);
    return {
        type: DELETE_RECENT_CLIENT,
        payload: request
    }
}


export function findClientByStrTypeIdAndNumber(jsonFindClient) {
    const json = {
        "messageHeader": {
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
        "messageBody": {
            strTypeDocument: jsonFindClient.strTypeDocument,
            typeDocument: jsonFindClient.typeDocument,
            numberDocument: jsonFindClient.numberDocument,
            strClientType: jsonFindClient.strClientType
        }
    };
    const request = axios.post(APP_URL + "/getClientByStrDocumentTypeAndNumber", json);
    return {
        type: CLIENTS_FIND_TYPE_NUMBER_BASIC,
        payload: request
    }
}

export function saveSelectValue(data) {
    return {
        type: SAVE_FILTER,
        data
    }
}

export function backButtonFilter(data) {
    return {
        type: BACK_BUTTON_FILTER,
        data
    }
}

export function clearSaveSelectedValue(){
    return{
        type: CLEAR_SAVE_FILTER
    }
}



