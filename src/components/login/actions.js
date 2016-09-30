import {APP_URL} from '../../constantsGlobal';
import { VALIDATE_LOGIN, CHANGE_STATUS_LOGIN, CLEAR_STATE } from './constants';
import axios from 'axios';
import $ from 'jquery';

export function validateLogin(username, password){
  const json = {
      messageHeader: {
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
      messageBody: {
        "username": username,
        "password": password
      }
    }
  var request = axios.post(APP_URL + "/userAuthentication2", json);
  return {
    type: VALIDATE_LOGIN,
    payload: request
  }
}

export function saveSessionToken(sessionToken) {
  window.localStorage.setItem('sessionToken', sessionToken);
  return {
      type: CHANGE_STATUS_LOGIN,
      payload: ""
  }
}

export function clearStateLogin(){
  return {
      type: CLEAR_STATE,
      payload: ""
  }
}
