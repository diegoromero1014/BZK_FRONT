import { APP_URL } from '../../../constantsGlobal';
import {
    GET_CONTEXT_CLIENT, SAVE_CREDIT_STUDY, VALIDATE_INFO_CREDIT_STUDY,
    UPDATE_NOT_APPLY_CREDIT_CONTACT, EXISTS_PDF_FOR_SAME_DAY
} from './constants';
import axios from 'axios';
import _ from 'lodash';
import { generatePDF as _generatePDF} from "../../reports/pdf/actions";

export function getContextClient(idClient, type) {
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
        messageBody: idClient
    }
    var request = axios.post(APP_URL + "/validateInfoCreditStudy", jsonComplete);
    return {
        type: VALIDATE_INFO_CREDIT_STUDY,
        payload: request
    }
}

export function updateNotApplyCreditContact(jsonCreditContact) {
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
        messageBody: jsonCreditContact
    }
    var request = axios.post(APP_URL + "/updateNotApplyCreditContact", jsonComplete);
    return {
        type: UPDATE_NOT_APPLY_CREDIT_CONTACT,
        payload: request
    }
}

export function existsPDFforTheSameDay(){
    const json = {
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
        messageBody: window.sessionStorage.getItem('idClientSelected')
    }

    var request = new Promise((resolve, reject) => setTimeout(() => {resolve(true)}, 100 ));
    return {
        type: EXISTS_PDF_FOR_SAME_DAY,
        payload: request
    }
}

export function generatePDF(changeStateSaveData,namePDf) {
    const requestBody = {
      name: namePDf,
      route: "BiztrackReports/reportContextClient.jrxml",
      params: {
        P_CLIENT_ID: Number(window.sessionStorage.getItem("idClientSelected"))
      },
      source: []
    };

    _generatePDF(changeStateSaveData, requestBody);
}