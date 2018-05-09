import { APP_URL } from '../../constantsGlobal';
import { UPDATE_ACTIVE_TAB_CS, VALIDATE_CLIENTS, UPDATE_TEAM_CLIENTS, APROVE_DELIVERY_CLIENT, 
    GET_ALL_TEAMS, CHANGE_ECONOMIC_GROUP, SAVE_CONTEXT_CLIENT  } from './constants';
import axios from 'axios';

export function clientsByEconomicGroup(idClient, idEconomicGroup) {
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
            "idClient": idClient,
            "idEconomicGroup": idEconomicGroup
        }
    };

    var request = axios.post(APP_URL + "/validateClientAndEconomicGroupESC", json);
    return {
        type: VALIDATE_CLIENTS,
        payload: request
    }
}

export function updateTabSeletedCS(tabActive) {
    return {
        type: UPDATE_ACTIVE_TAB_CS,
        payload: tabActive
    }
}


export function updateTeamClients(jsonBody) {
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
        "messageBody": jsonBody
    };

    var request = axios.post(APP_URL + "/updateTeamClients", json);
    return {
        type: UPDATE_TEAM_CLIENTS,
        payload: request
    }
}


export function aproveRejectDeliveryClient(idClient, aprove) {
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
            "idClient": idClient,
            "aprove": aprove
        }
    };

    var request = axios.post(APP_URL + "/aproveOrRejectChangeTeam", json);
    return {
        type: APROVE_DELIVERY_CLIENT,
        payload: request
    }
}

export function getAllteams() {
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
        "messageBody": ""
    };

    var request = axios.post(APP_URL + "/getAllTeams", json);
    return {
        type: GET_ALL_TEAMS,
        payload: request
    }
}

export function updateCheckEconomicGroup(value) {
    return {
        type: CHANGE_ECONOMIC_GROUP,
        value
    }
}

export function saveContextClientDeliveryClients(jsonContext) {
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
        "messageBody": jsonContext
    };

    var request = axios.post(APP_URL + "/saveMainClientsAndSuppliers", json);
    return {
        type: SAVE_CONTEXT_CLIENT,
        payload: request
    }
}
