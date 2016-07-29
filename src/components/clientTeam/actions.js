import {APP_URL} from '../../constantsGlobal';
import {TEAM_PARTICIPANTS} from './constants';
import axios from 'axios';

export function getClientTeam(id){
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
      "clientId": id
    }
  }

  var request = axios.post(APP_URL + "/getClientTeam", json);
  return{
    type: TEAM_PARTICIPANTS,
    payload: request
  }
}
