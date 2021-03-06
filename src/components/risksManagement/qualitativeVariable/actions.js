import { APP_URL } from '../../../constantsGlobal';
import {
    GET_SURVEY_QUALITATIVE, SAVE_ANSWER, FIELDS_EDITABLES,
    SAVE_RESPONSE_SURVEY, CLEAR_SURVEY, CAHNGE_VALUE_MODAL,
    GET_ALLOW_SURVEY_QUALITATIVE, GENERATE_PDF,
    SAVE_CLIENT_SURVEY, GET_EXIST_PDF_VC
} from './constants';
import axios from 'axios';


export function getAllowSurveyQualitativeVarible(idClient) {
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
    }
    var request = axios.post(APP_URL + "/getAllowSurveyQualitativeVariable", json);
    return {
        type: GET_ALLOW_SURVEY_QUALITATIVE,
        payload: request
    }
}


export function getSurveyQualitativeVarible() {
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
        "messageBody": window.sessionStorage.getItem('idClientSelected')
    }
    var request = axios.post(APP_URL + "/getSurveyQualitativeVariable", json);
    return {
        type: GET_SURVEY_QUALITATIVE,
        payload: request
    }
}

export function clearSurvey() {
    return {
        type: CLEAR_SURVEY
    }
}

export function changeFieldsEditables(value) {
    return {
        type: FIELDS_EDITABLES,
        value
    }
}

export function saveAnswerQuestion(listQuestions, nameList) {
    return {
        type: SAVE_ANSWER,
        listQuestions,
        nameList
    }
}

export function changeValueModalIsOpen(value) {
    return {
        type: CAHNGE_VALUE_MODAL,
        value
    }
}



export function saveResponseQualitativeSurvey(jsonSave) {
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
        "messageBody": jsonSave
    }
    var request = axios.post(APP_URL + "/saveResponseQualitativeSurvey", json);
    return {
        type: SAVE_RESPONSE_SURVEY,
        payload: request
    }
}

export function pdfDescarga(jsonPDF) {
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
        "messageBody": jsonPDF
    }
    var request = axios.post(APP_URL + "/pdfReportQualitativeVariables", json);
    return {
        type: GENERATE_PDF,
        payload: request
    }
}

export function saveClientSurvey(jsonClietnSurvey) {
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
        "messageBody": jsonClietnSurvey
    }
    var request = axios.post(APP_URL + "/saveClientSurvey", json);
    return {
        type: SAVE_CLIENT_SURVEY,
        payload: request
    }
}

export function getExistPdfVC(jsonClietnSurvey) {
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
        "messageBody": jsonClietnSurvey
    }
    var request = axios.post(APP_URL + "/getExistPdfVC", json);
    return {
        type: GET_EXIST_PDF_VC,
        payload: request
    }
}
