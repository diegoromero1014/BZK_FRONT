import axios from 'axios';
import { APP_URL } from '../../../../constantsGlobal';

export const getImportantDates = (action, type, max, first) => ({ 
    type: action, 
    payload: axios.post(APP_URL + "/getImportantDatesContact", {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionTokenFront')
        },
        "messageBody": {
            type,
            max,
            first
        }
    })
});