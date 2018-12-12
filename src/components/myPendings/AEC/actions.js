import { APP_URL } from '../../../constantsGlobal';
import {
    GET_AEC_FOR_EMPLOYEE, SAVE_COMMERCIAL_OBSERVATIONS, GET_DETAIL_AEC, CLEAR_DETAIL_AEC, CHANGE_PAGE,
    LIMITE_INF
} from './constants';
import axios from 'axios';

export function getAECForEmployee(pageNum, maxRows) {
    const json = {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
            "username": "",
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
            "pageNum": pageNum,
            "maxRows": maxRows
        }
    };


    var request = axios.post(APP_URL + "/getAECListForEmployee", json);
    return {
        type: GET_AEC_FOR_EMPLOYEE,
        payload: request
    }
}

export function saveCommercialObservations(jsonAEC) {
    const json = {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
            "username": "",
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
        "messageBody": jsonAEC
    };


    var request = axios.post(APP_URL + "/saveCommercialObservations", json);
    return {
        type: SAVE_COMMERCIAL_OBSERVATIONS,
        payload: request
    }
}

export function getDetailAEC(idAEC) {
    const json = {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
            "username": "",
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
        "messageBody": idAEC.toString()
    };


    var request = axios.post(APP_URL + "/getDetailAec", json);
    return {
        type: GET_DETAIL_AEC,
        payload: request
    }
}

export function clearDetailAEC() {
    return {
        type: CLEAR_DETAIL_AEC
    };
}

export function limitInf(limInf) {
    return {
        type: LIMITE_INF,
        limInfe: limInf
    }
}

export function changePage(page) {
    return {
        type: CHANGE_PAGE,
        currentPage: page
    }
}