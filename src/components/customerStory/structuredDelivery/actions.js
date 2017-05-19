import { UPDATE_EVENT_ERRORS, SAVE_STRUCTURED_DELIVERY, STRUCTURED_DELIVERY_DETAIL } from './constants';
import axios from 'axios';
import { APP_URL } from '../../../constantsGlobal';

export function updateEventErrors(eventErrors) {
    return {
        type: UPDATE_EVENT_ERRORS,
        payload: eventErrors
    };
}

export function saveStructuredDelivery(jsonStructuredDelivery) {
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
        "messageBody": jsonStructuredDelivery
    }

    var request = axios.post(APP_URL + "/saveStructuredDelivery", json);
    return {
        type: SAVE_STRUCTURED_DELIVERY,
        payload: request
    }
}

export function structuredDeliveryDetail(idClient) {
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
    }

    var request = axios.post(APP_URL + "/structuredDeliveryDetail", json);
    return {
        type: STRUCTURED_DELIVERY_DETAIL,
        payload: request
    }
}
