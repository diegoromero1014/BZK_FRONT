import {APP_URL} from '../../constantsGlobal';
import { VALIDATE_LOGIN } from './constants';
import axios from 'axios';

export function validateLogin(username, password){
  const json = {
      messageHeader: {
        "username": username,
        "sessionToken": "",
        "timestamp": new Date().getTime(),
        "service": "",
        "sessionExpiryInterval": 180000,
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
  var request = axios.post(APP_URL + "/userAuthentication", json);
  return {
    type: VALIDATE_LOGIN,
    payload: request
  }
}
