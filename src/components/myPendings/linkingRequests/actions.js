import axios from 'axios';
import { APP_URL } from '../../../constantsGlobal';
import {
    GET_LINK_REQUESTS, LIMITE_INF, CHANGE_PAGE, GET_OBSERVATIONS_BY_LINKING_REQUESTS,
    CLEAR_LIST_OBSERVATIONS, SAVE_OBSERVATION, CLEAR_LINK_REQUEST_PAGINATOR
} from './constants';

export function getLinkRequests(pageNum, maxRows, keyWord) {
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
            "maxRows": maxRows,
            "searchTerm": keyWord
        }
    };

    var request = axios.post(APP_URL + "/getLinkRequests", json);
    return {
        type: GET_LINK_REQUESTS,
        payload: request
    }
}

export function getListObservactionsByIdLink(idLinkingRequests) {
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
        "messageBody": idLinkingRequests
    };


    var request = axios.post(APP_URL + "/frontoffice/getListObservactionsByIdLink", json);
    return {
        type: GET_OBSERVATIONS_BY_LINKING_REQUESTS,
        payload: request
    }
}

export function saveObservationLinkingRequest(idLinkingRequests, observation) {
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
            idLinkRequest: idLinkingRequests,
            observation
        }
    };


    var request = axios.post(APP_URL + "/saveObservationLinkingRequest", json);
    return {
        type: SAVE_OBSERVATION,
        payload: request
    }
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

export function clearListObservations() {
    return {
        type: CLEAR_LIST_OBSERVATIONS
    }
}

export function clearLinkRequestPaginator() {
    return {
        type: CLEAR_LINK_REQUEST_PAGINATOR
    };
}