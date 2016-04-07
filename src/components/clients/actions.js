import {APP_URL} from '../../constantsGlobal';
import {CLIENTS_FIND} from './constants';
import axios from 'axios';

export function clientsFindServer(keyword, limInf, limSup){
  console.log('clientsFind');
  const json = {
    "messageHeader":{
      "sessionToken": window.localStorage.getItem('sessionToken'),
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
    "messageBody":{
      "keyword": keyword,
      "limInf": limInf,
      "limSup": limSup
    }
  }

  var request = axios.post(APP_URL + "/clientListForEmployee", json);
  return{
    type: CLIENTS_FIND,
    payload: request
  }
}
