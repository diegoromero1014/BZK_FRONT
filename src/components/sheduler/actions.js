import { APP_URL } from '../../constantsGlobal';
import axios from 'axios';
import { GET_SCHEDULER_PREVISIT, CLEAR_SCHEDULER_PREVISIT, CHANGE_TEAM, CHANGE_REGION, CHANGE_ZONE, GET_TEAMS_EMPLOYEE } from "./constants";

export function getSchedulerPrevisits(idTeam, idRegion, idZone, idUser) {
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
            idTeam: idTeam,
            idRegion: idRegion,
            idZone: idZone,
            idCreatedBy: idUser
        }
    }

    var request = axios.post(APP_URL + "/schedulerPrevisits", json);

    return {
        type: GET_SCHEDULER_PREVISIT,
        payload: request
    }
}

export function clearFilter() {
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
            idTeam: null,
            idRegion: null,
            idZone: null
        }
    }

    var request = axios.post(APP_URL + "/schedulerPrevisits", json);

    return {
        type: CLEAR_SCHEDULER_PREVISIT,
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

export function getAllTeamsByEmployee() {

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
            username: window.sessionStorage.getItem('userName')
        }
    }

    let request = axios.post(APP_URL+'/TeamsByEmployee', json);
    
      return {
        type: GET_TEAMS_EMPLOYEE,
        payload: request
      };

}
