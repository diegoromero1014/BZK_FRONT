import * as constants from './constants';
import { APP_URL } from '../../../constantsGlobal';
import axios from 'axios';

export function deleteNeed(index) {
  return {
    type: constants.DELETE_NEED,
    index
  };
}

export function addNeed(need) {
  return {
    type: constants.ADD_NEED,
    data: need
  };
}

export function editNeed(need) {
  return {
    type: constants.EDIT_NEED,
    data: need
  };
}

export function clearNeed() {
  return {
    type: constants.CLEAR_NEED
  };
}

export function validateWhiteListOnNeed(jsonValidateNeed) {
  const jsonValidate = {
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
    messageBody: jsonValidateNeed
  }
  var request = axios.post(APP_URL + "/validateWhiteListOnNeed", jsonValidate);
  return {
    type: constants.VALIDATE_NEED,
    payload: request
  }
}
