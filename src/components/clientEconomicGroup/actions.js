import {APP_URL} from '../../constantsGlobal';
import {CONSULT_ECONOMIC_GROUP} from './constants';
import axios from 'axios';

export function getClientsEconomicGroup(id){
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
      "groupId": id
    }
  }

  var request = axios.post(APP_URL + "/getGroupTeam", json);
  return{
    type: CONSULT_ECONOMIC_GROUP,
    payload: request
  }
}
