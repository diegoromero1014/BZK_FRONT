/**
 * Created by ahurtado on 12/06/2016.
 */
import {APP_URL} from '../../constantsGlobal';
import {
    FIND_CLIENTS_PORTFOLIO_EXPIRATION, CHANGE_PAGE_FOR_ALERT_PORTFOLIO_EXPIRATION,
    CLEAR_CLIENT_ORDER_PE, CLEAR_CLIENT_PAGINATION_PE, ORDER_COLUMN_CLIENT_PE,
    CHANGE_KEYWORD_NAME_NIT_PE, CLEAR_FILTER_CLIENTS_PE, UPDATE_NUMBER_TOTAL_CLIENTS_PE, NUMBER_RECORDS,
    CHANGE_TEAM_PE, CHANGE_REGION_PE, CHANGE_ZONE_PE, SAVE_OBSERVATIONS
} from './constants';
import axios from 'axios';

export function clientsPortfolioExpirationFindServer(keyWordNameNit, idTeam, idRegion, idZone, pageNum, maxRows,order,columnOrder) {
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

    const request = axios.post(APP_URL + "/getClientsPortfolioExpiration", json);
    return {
        type: FIND_CLIENTS_PORTFOLIO_EXPIRATION,
        payload: request
    }
}

export function changePage(page) {
    return {
        type: CHANGE_PAGE_FOR_ALERT_PORTFOLIO_EXPIRATION,
        currentPage: page
    }
}

export function changeKeyword(keyword) {
    return {
        type: CHANGE_KEYWORD_NAME_NIT_PE,
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
    const request = axios.post(APP_URL + "/getClientsPortfolioExpiration", json);
    return {
        type: CLEAR_FILTER_CLIENTS_PE,
        payload: request
    }
}

export function changeTeam(idTeam) {
    return {
        type: CHANGE_TEAM_PE,
        idTeam
    }
}
export function changeRegion(idRegion) {
    return {
        type: CHANGE_REGION_PE,
        idRegion
    }
}
export function changeZone(idZone) {
    return {
        type: CHANGE_ZONE_PE,
        idZone
    }
}

export function clearClientOrder() {
    return {
        type: CLEAR_CLIENT_ORDER_PE
    };
}

export function clearClientPagination() {
    return {
        type: CLEAR_CLIENT_PAGINATION_PE
    };
}

export function updateNumberTotalClients(totalClients) {
    return {
        type: UPDATE_NUMBER_TOTAL_CLIENTS_PE,
        totalClients
    };
}

export function orderColumnClientPortfolioExpiration(orderClients, columnClients) {
    return {
        type: ORDER_COLUMN_CLIENT_PE,
        orderClients,
        columnClients
    };
}

export function saveObservationPortfolioExp(idAlertPortfolioExp, observations) {
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
            "idAlert": idAlertPortfolioExp,
            observations
        }
    };
    const request = axios.post(APP_URL + "/saveObservationsAlertPortfolioExp", json);
    return {
        type: SAVE_OBSERVATIONS,
        payload: request
    }
}