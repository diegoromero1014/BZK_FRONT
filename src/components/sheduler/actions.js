import { APP_URL } from '../../constantsGlobal';
import axios from 'axios';
import { GET_SCHEDULER_PREVISIT, CLEAR_SCHEDULER_PREVISIT, CHANGE_TEAM } from "./constants";

export function getSchedulerPrevisits(idTeam, idRegion, idZone, idUser) {
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
    return {
        type: CLEAR_SCHEDULER_PREVISIT
    }
}

export function changeTeam(idTeam) {
    return {
        type: CHANGE_TEAM,
        idTeam
    }
}




