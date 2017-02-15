/**
 * Created by IAS-ASUS on 2/2/2017.
 */

import {APP_URL} from '../../../constantsGlobal';
import {CLIENTS_COVENANTS, CONSULT_INFO_COVENANT, CLEAR_COVENANT} from './constants';
import axios from 'axios';

export function clientCovenants() {
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
        "messageBody": window.localStorage.getItem('idClientSelected')
    };

    const request = axios.post(APP_URL + "/getCovenantsByIdClientFront", json);
    return {
        type: CLIENTS_COVENANTS,
        payload: request
    }
}

export function getInfoCovenant(idCovenant) {
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
        "messageBody": idCovenant
    };

    const request = axios.post(APP_URL + "/getInfoCovenant", json);
    return {
        type: CONSULT_INFO_COVENANT,
        payload: request
    }
}

export function clearCovenant(){
    return {
        type: CLEAR_COVENANT
    }
}