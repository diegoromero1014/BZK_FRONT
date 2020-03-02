import {APP_URL} from '../../constantsGlobal';
import {SAVE_SENIOR_BANKER, TEAM_PARTICIPANTS} from './constants';
import axios from 'axios';

export function getClientTeam(id){
  const json = {
    "messageHeader":{
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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
      "clientId": id
    }
  }

  var request = axios.post(APP_URL + "/getClientTeam", json);
  return{
    type: TEAM_PARTICIPANTS,
    payload: request
  }
}

export function saveSeniorBanker(checked) {
  const jsonComplete = {
    messageHeader:{
      "sessionToken": window.localStorage.getItem('sessionTokenFront')
    },
    messageBody: {
      "clietnId": window.sessionStorage.getItem('idClientSelected'),
      "check": !checked
    }
  };

  var request = axios.post(APP_URL + "/checkSeniorBanker", jsonComplete);
  return{
    type: SAVE_SENIOR_BANKER,
    payload: request
  }
}
