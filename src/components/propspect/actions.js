import { APP_URL } from '../../constantsGlobal';
import { VALIDATE_PROSPECT_EXISTS, CLEAR_STATE_PROSPECT, CLEAR_ALL_PROSPECT, CREATE_PROSPECT } from './constants';
import axios from 'axios';

export function validateProspectExists(typeDocument, numberDocument) {
  const json = {
    messageHeader: {
      "timestamp": new Date().getTime(),
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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
  var request = axios.post(APP_URL + "/validateProspectExists", json);
  return {
    type: VALIDATE_PROSPECT_EXISTS,
    payload: request
  }
}

export function clearState() {
  return {
    type: CLEAR_STATE_PROSPECT
  };
}

export function clearAllState() {
  return {
    type: CLEAR_ALL_PROSPECT
  };
}

export function createProspect(jsonCreateProspect) {
  const jsonComplete = {
    messageHeader: {
      "timestamp": new Date().getTime(),
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
      "service": "",
      "status": "0",
      "language": "es",
      "displayErrorMessage": "",
      "technicalErrorMessage": "",
      "applicationVersion": "",
      "debug": true,
      "isSuccessful": true
    },
    messageBody: jsonCreateProspect
  }
  var request = axios.post(APP_URL + "/saveClient", jsonComplete);
  return {
    type: CREATE_PROSPECT,
    payload: request
  }
}
