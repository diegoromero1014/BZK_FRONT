/**
 * Created by Andres Hurtado on 01/03/2017.
 */
import {APP_URL} from '../../constantsGlobal';
import * as constant from './constants';
import axios from 'axios';

export function blackListFindServer(keyWordNameNit, keyWordNameNitClient, typeEntity, pageNum, maxRows,order,columnOrder) {
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
            "keyWordNameNitClient": keyWordNameNitClient,
            "typeEntity": typeEntity,
            "pageNum": pageNum,
            "maxRows": maxRows,
            "order" : order,
            "columnOrder" : columnOrder
        }
    };

    const request = axios.post(APP_URL + "/getBlackListsAlert", json);
    return {
        type: constant.FIND_ALERT_BLACK_LIST,
        payload: request
    }
}

export function changePage(page) {
    return {
        type: constant.CHANGE_PAGE_FOR_BLACK_LIST,
        currentPage: page
    }
}

export function changeKeyword(keywordNameNit) {
    return {
        type: constant.CHANGE_KEYWORD_NAME_NIT_BLACK_LIST,
        keywordNameNit
    }
}

export function changeKeywordClient(keywordNameNitClient) {
    return {
        type: constant.CHANGE_KEYWORD_NAME_NIT_BLACK_LIST_CLIENT,
        keywordNameNitClient
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
            "keyWordNameNitClient": null,
            "typeEntity": null,
            "pageNum": 1,
            "maxRows": constant.NUMBER_RECORDS,
            "order" : 0,
            "columnOrder" : null
        }
    };
    const request = axios.post(APP_URL + "/getBlackListsAlert", json);
    return {
        type: constant.CLEAR_FILTER_ALERT_BLACK_LIST,
        payload: request
    }
}

export function changeTypeEntity(typeEntity) {
    return {
        type: constant.CHANGE_TYPE_ENTITY_BLACK_LIST,
        typeEntity
    }
}

export function clearClientOrder() {
    return {
        type: constant.CLEAR_CLIENT_ORDER_BLACK_LIST
    };
}

export function clearClientPagination() {
    return {
        type: constant.CLEAR_CLIENT_PAGINATION_BLACK_LIST
    };
}

export function updateNumberTotalBlackList(totalCovenants) {
    return {
        type: constant.UPDATE_NUMBER_TOTAL_BLACK_LIST,
        totalCovenants
    };
}

export function orderColumnBlackList(orderClients, columnClients) {
    return {
        type: constant.ORDER_COLUMN_CLIENT_BLACK_LIST,
        orderClients,
        columnClients
    };
}