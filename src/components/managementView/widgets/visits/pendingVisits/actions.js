import axios from 'axios';
import { APP_URL } from '../../../../../constantsGlobal';
import { REQUEST_PENDING_VISITS } from "../constants";

export const requestPendingVisits = (first, max) => ({
    type: REQUEST_PENDING_VISITS,
    payload: axios.post(APP_URL + "/getPendingVisits", {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionTokenFront')
        },
        "messageBody": {
            first,
            max
        }
    })
})