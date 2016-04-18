import {APP_URL} from '../../constantsGlobal';
import { CLIENT_ID_TYPE } from './constants';
import axios from 'axios';

export function consultDataSelect(field){
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
        "field": field
      }
    }
  var request = axios.post(APP_URL + "/masterDataByField", json);
  return {
    type: CLIENT_ID_TYPE,
    payload: request
  }
}
