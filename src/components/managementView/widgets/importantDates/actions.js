import axios from 'axios';
import { APP_URL } from '../../../../constantsGlobal';

export const getImportantDates = (action, type, first, max) => ({ 
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