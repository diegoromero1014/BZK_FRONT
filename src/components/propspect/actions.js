import {APP_URL} from '../../constantsGlobal';
import { VAIDATE_PROSPECT_EXISTS } from './constants';
import axios from 'axios';

export function validateProspectExists(typeDocument, numberDocument){
  const json = {
      messageHeader: {
        "timestamp": new Date().getTime(),
        "sessionToken": window.localStorage.getItem('sessionToken'),
        "service": "",
        "status": "0",
        "language": "es",
        "displayErrorMessage": "",
        "technicalErrorMessage": "",
        "applicationVersion": "",
        "debug": true,
        "isSuccessful": true
      },
      messageBody: {
        "typeDocument": typeDocument,
        "numberDocument": numberDocument
      }
    }
  var request = axios.post(APP_URL + "/validatePropspectExists", json);
  return {
    type: VAIDATE_PROSPECT_EXISTS,
    payload: request
  }
}
