import { APP_URL } from '../../../constantsGlobal';
import { GET_CONTEXT_CLIENT, SAVE_CREDIT_STUDY, VALIDATE_INFO_CREDIT_STUDY } from './constants';
import axios from 'axios';
import _ from 'lodash';

export function getContextClient(idClient, type) {
    const json = {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionToken'),
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

    var request = axios.post(APP_URL + "/getContextClientByClient", json);
    return {
        type: _.isUndefined(type) || _.isNull(type) ? GET_CONTEXT_CLIENT : type,
        payload: request
    }
}

export function saveCreditStudy(jsonCreditStudy) {
    const jsonComplete = {
        messageHeader: {
            "timestamp": new Date().getTime(),
            "sessionToken": window.localStorage.getItem('sessionToken'),
            "service": "",
            "status": "0",
            "language": "es",
            "displayErrorMessage": "",
            "technicalErrorMessage": "",
            "applicationVersion": "",
            "debug": true,
            "isSuccessful": true
        },
        messageBody: jsonCreditStudy
    }
    var request = axios.post(APP_URL + "/saveContextClient", jsonComplete);
    return {
        type: SAVE_CREDIT_STUDY,
        payload: request
    }
}

export function validateInfoCreditStudy(idClient) {
    const jsonComplete = {
        messageHeader: {
            "timestamp": new Date().getTime(),
            "sessionToken": window.localStorage.getItem('sessionToken'),
            "service": "",
            "status": "0",
            "language": "es",
            "displayErrorMessage": "",
            "technicalErrorMessage": "",
            "applicationVersion": "",
            "debug": true,
            "isSuccessful": true
        },
        messageBody: idClient
    }
    var request = axios.post(APP_URL + "/validateInfoCreditStudy", jsonComplete);
    return {
        type: VALIDATE_INFO_CREDIT_STUDY,
        payload: request
    }
}