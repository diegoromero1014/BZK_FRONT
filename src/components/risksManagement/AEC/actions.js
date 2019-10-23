import { APP_URL } from '../../../constantsGlobal';
import { GET_ASSETS_AEC, GET_DETAIL_AEC, CLEAR_AEC, CLEAR_LIST_AEC, CLEAR_DETAIL_AEC } from './constants';
import axios from 'axios';
import { generatePDF } from '../../reports/pdf/actions';

export function getAssetsAEC(jsonAEC) {
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
        "messageBody": jsonAEC
    }
    var request = axios.post(APP_URL + "/getAssetsAEC", json);
    return {
        type: GET_ASSETS_AEC,
        payload: request
    }
}

export function getDetailAEC(idAEC) {
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
        "messageBody": idAEC
    }
    var request = axios.post(APP_URL + "/getDetailAec", json);
    return {
        type: GET_DETAIL_AEC,
        payload: request
    }
}

export function downloadPDF(changeStateSaveData, idAEC){
    const requestBody = {
        "name": "AEC.pdf",
        "route": "BiztrackReports/aec.jrxml",
        "params": {
            "P_ID_AEC": Number(idAEC)
        },
        "source": []
    };
    generatePDF(changeStateSaveData, requestBody);
}

export function clearDetailAEC() {
    return {
        type: CLEAR_DETAIL_AEC
    }
}

export function clearListAEC() {
    return {
        type: CLEAR_LIST_AEC
    }
}