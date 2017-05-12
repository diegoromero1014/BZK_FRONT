import { APP_URL } from '../../constantsGlobal';
import { UPDATE_ACTIVE_TAB_CS, VALIDATE_CLIENTS, UPDATE_TEAM_CLIENTS } from './constants';
import axios from 'axios';

export function clientsByEconomicGroup(idClient, idEconomicGroup) {
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
        "messageBody": jsonBody
    };

    var request = axios.post(APP_URL + "/updateTeamClients", json);
    return {
        type: UPDATE_TEAM_CLIENTS,
        payload: request
    }
}