import {APP_URL} from '../../constantsGlobal';
import * as constant from './constants';
import axios from 'axios';

export function covenantsFindServer(keyWordNameNit, statusCovenant, pageNum, maxRows,order,columnOrder) {
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
        "messageBody": {
            "keyWordNameNit": keyWordNameNit,
            "statusCovenant": statusCovenant,
            "pageNum": pageNum,
            "maxRows": maxRows,
            "order" : order,
            "columnOrder" : columnOrder
        }
    };

    const request = axios.post(APP_URL + "/getCovenantsAlert", json);
    return {
        type: constant.FIND_ALERT_COVENANTS,
        payload: request
    }
}

export function covenantsAlerts(pageNum, maxRows,order,columnOrder) {
    const json = {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionTokenFront')
        },
        "messageBody": {
            "pageNum": pageNum,
            "maxRows": maxRows,
            "order" : order,
            "columnOrder" : columnOrder
        }
    };

    const request = axios.post(APP_URL + "/getCovenantsAlert", json);
    return {
        type: constant.FIND_ALERT_COVENANTS,
        payload: request
    }
}

export function changePage(page) {
    return {
        type: constant.CHANGE_PAGE_FOR_COVENANTS,
        currentPage: page
    }
}

export function changeKeyword(keyword) {
    return {
        type: constant.CHANGE_KEYWORD_NAME_NIT_COVENANT,
        keywordNameNit: keyword
    }
}

export function defaultValues() {
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
            "keyWordNameNit": null,
            "statusCovenant": '0',
            "pageNum": 1,
            "maxRows": constant.NUMBER_RECORDS,
            "order" : 0,
            "columnOrder" : null
        }
    };
    const request = axios.post(APP_URL + "/getCovenantsAlert", json);
    return {
        type: constant.INITIAL_VALUES,
        payload: request
    }
}

export function clearFilter() {

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
            "keyWordNameNit": null,
            "statusCovenant": -1,
            "pageNum": 1,
            "maxRows": constant.NUMBER_RECORDS,
            "order" : 0,
            "columnOrder" : null
        }
    };
    const request = axios.post(APP_URL + "/getCovenantsAlert", json);
    return {
        type: constant.CLEAR_FILTER_ALERT_COVENANT,
        payload: request
    }
}

export function changeStatusCovenant(statusCovenant) {
    return {
        type: constant.CHANGE_STATUS_COVENANT,
        statusCovenant
    }
}

export function clearClientOrder() {
    return {
        type: constant.CLEAR_CLIENT_ORDER
    };
}

export function clearClientPagination() {
    return {
        type: constant.CLEAR_CLIENT_PAGINATION
    };
}

export function updateNumberTotalCovenants(totalCovenants) {
    return {
        type: constant.UPDATE_NUMBER_TOTAL_COVENANTS,
        totalCovenants
    };
}

export function orderColumnCovenants(orderClients, columnClients) {
    return {
        type: constant.ORDER_COLUMN_CLIENT,
        orderClients,
        columnClients
    };
}