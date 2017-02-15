/**
 * Created by ahurtado on 11/23/2016.
 */
import {APP_URL} from '../../constantsGlobal';
import {
    FIND_ALERT_COVENANTS, CHANGE_PAGE_FOR_COVENANTS,
    CLEAR_CLIENT_ORDER, CLEAR_CLIENT_PAGINATION, ORDER_COLUMN_CLIENT,
    CHANGE_KEYWORD_NAME_NIT_COVENANT, CLEAR_FILTER_ALERT_COVENANT, UPDATE_NUMBER_TOTAL_COVENANTS, NUMBER_RECORDS,
    CHANGE_STATUS_COVENANT
} from './constants';
import axios from 'axios';

export function covenantsFindServer(keyWordNameNit, statusCovenant, pageNum, maxRows,order,columnOrder) {
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
        "messageBody": {
            "keyWordNameNit": keyWordNameNit,
            "statusCovenant": statusCovenant,
            "pageNum": pageNum,
            "maxRows": maxRows,
            "order" : order,
            "columnOrder" : columnOrder
        }
    };

    // const request = axios.post(APP_URL + "/getClientsPendingUpdateAlert", json);
    const request = {};
    return {
        type: FIND_ALERT_COVENANTS,
        payload: request
    }
}

export function changePage(page) {
    return {
        type: CHANGE_PAGE_FOR_COVENANTS,
        currentPage: page
    }
}

export function changeKeyword(keyword) {
    return {
        type: CHANGE_KEYWORD_NAME_NIT_COVENANT,
        keywordNameNit: keyword
    }
}

export function clearFilter() {

    const json = {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionToken'),
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
            "statusCovenant": null,
            "pageNum": 1,
            "maxRows": NUMBER_RECORDS,
            "order" : 0,
            "columnOrder" : null
        }
    };
    // const request = axios.post(APP_URL + "/getClientsPendingUpdateAlert", json);
    const request = {};
    return {
        type: CLEAR_FILTER_ALERT_COVENANT,
        payload: request
    }
}

export function changeStatusCovenant(statusCovenant) {
    return {
        type: CHANGE_STATUS_COVENANT,
        statusCovenant
    }
}

export function clearClientOrder() {
    return {
        type: CLEAR_CLIENT_ORDER
    };
}

export function clearClientPagination() {
    return {
        type: CLEAR_CLIENT_PAGINATION
    };
}

export function updateNumberTotalCovenants(totalCovenants) {
    return {
        type: UPDATE_NUMBER_TOTAL_COVENANTS,
        totalCovenants
    };
}

export function orderColumnCovenants(orderClients, columnClients) {
    return {
        type: ORDER_COLUMN_CLIENT,
        orderClients,
        columnClients
    };
}