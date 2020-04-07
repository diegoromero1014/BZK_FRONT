import axios from 'axios';
import { APP_URL } from '../../../../constantsGlobal';
import { ACTION_OUTDATED_CONTACTS } from "./constants";

export const getOutdatedContacts = (first, max) => ({  
    type: ACTION_OUTDATED_CONTACTS,
    payload: axios.post(APP_URL + "/outdatedContacts", {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionTokenFront')
        },
        "messageBody": {
            first,
            max
        }
    })
  });