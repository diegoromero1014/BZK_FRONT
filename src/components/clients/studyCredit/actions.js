import { APP_URL } from '../../../constantsGlobal';
import { GET_CONTEXT_CLIENT } from './constants';
import axios from 'axios';

export function getContextClient(idClient) {
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
        type: GET_CONTEXT_CLIENT,
        payload: request
    }
}
