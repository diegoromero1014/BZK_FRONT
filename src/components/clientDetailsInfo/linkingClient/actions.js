/**
 * Created by Andres Hurtado on 23/03/2017.
 */
export const CONSULT_BLACK_LIST_CLIENT = "CONSULT_BLACK_LIST_CLIENT";
import {APP_URL} from '../../../constantsGlobal';
import axios from 'axios';

export function consultStateBlackListClient(jsonLinkEntityClient){
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
        messageBody: jsonLinkEntityClient
    };
    const request = axios.post(APP_URL + "/consumeBlackListServiceOneToOne", jsonComplete);
    return {
        type: CONSULT_BLACK_LIST_CLIENT,
        payload: request
    }
}