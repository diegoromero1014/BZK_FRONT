/**
 * Created by ahurtado on 11/23/2016.
 */
import {APP_URL} from '../../constantsGlobal';
import {
    CLIENTS_FIND_FOR_ALERT_PENDING_UPDATE, CHANGE_PAGE_FOR_ALERT_PENDING_UPDATE,
    CLEAR_CLIENT_ORDER, CLEAR_CLIENT_PAGINATION, ORDER_COLUMN_CLIENT,
    CHANGE_KEYWORD_NAME_NIT, CLEAR_FILTER_CLIENTS_PENDING_UPDATE, UPDATE_NUMBER_TOTAL_CLIENTS, NUMBER_RECORDS,
    CHANGE_TEAM, CHANGE_REGION, CHANGE_ZONE
} from './constants';
import axios from 'axios';

export function clientsPendingUpdateFindServer(keyWordNameNit, idTeam, idRegion, idZone, pageNum, maxRows,order,columnOrder) {
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
            "idTeam": idTeam,
            "idRegion": idRegion,
            "idZone": idZone,
            "pageNum": pageNum,
            "maxRows": maxRows,
            "order" : order,
            "columnOrder" : columnOrder
        }
    };

    const request = axios.post(APP_URL + "/getClientsPendingUpdateAlert", json);
    return {
        type: CLIENTS_FIND_FOR_ALERT_PENDING_UPDATE,
        payload: request
    }
}

export function changePage(page) {
    return {
        type: CHANGE_PAGE_FOR_ALERT_PENDING_UPDATE,
        currentPage: page
    }
}

export function changeKeyword(keyword) {
    return {
        type: CHANGE_KEYWORD_NAME_NIT,
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
            "idTeam": null,
            "idRegion": null,
            "idZone": null,
            "pageNum": 1,
            "maxRows": NUMBER_RECORDS,
            "order" : 0,
            "columnOrder" : null
        }
    };
    const request = axios.post(APP_URL + "/getClientsPendingUpdateAlert", json);
    return {
        type: CLEAR_FILTER_CLIENTS_PENDING_UPDATE,
        payload: request
    }
}

export function changeTeam(idTeam) {
    return {
        type: CHANGE_TEAM,
        idTeam
    }
}
export function changeRegion(idRegion) {
    return {
        type: CHANGE_REGION,
        idRegion
    }
}
export function changeZone(idZone) {
    return {
        type: CHANGE_ZONE,
        idZone
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

export function updateNumberTotalClients(totalClients) {
    return {
        type: UPDATE_NUMBER_TOTAL_CLIENTS,
        totalClients
    };
}

export function orderColumnClientPendingUpdate(orderClients, columnClients) {
    return {
        type: ORDER_COLUMN_CLIENT,
        orderClients,
        columnClients
    };
}