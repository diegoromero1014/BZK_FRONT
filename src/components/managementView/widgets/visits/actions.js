import axios from 'axios';
import { APP_URL } from '../../../../constantsGlobal';
import { ACTION_ECONOMIC_GROUPS_TO_BE_VISITED } from "./constants";

export const getEconomicGroupsToBeVisited = (first, max) => ({
    type: ACTION_ECONOMIC_GROUPS_TO_BE_VISITED,
    payload: axios.post(APP_URL + "/getEconomicGroupsToBeVisited", {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionTokenFront')
        },
        "messageBody": {
            first,
            max
        }
    })
});