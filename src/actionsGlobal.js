import * as constants from './constantsGlobal';
import axios from 'axios';

export function consultParameterServer(tagConsult){
  const json = {
    "messageHeader": {
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
    "messageBody": {
      "name": tagConsult
    }
  }

   var request = axios.post(constants.APP_URL + "/getParameterByName", json);
   return{
     type: constants.CONSULT_PARAMETER_NAME,
     payload: request
   }
}

export function changeValueActiveLog(value){
  const json = {
    "messageHeader": {
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
    "messageBody": value
  }

   var request = axios.post(constants.APP_URL + "/changeValueLog", json);
   return{
     type: constants.CHANGE_VALUE_LOGS,
     payload: request
   }
}

export function consultValueActiveLog(){
  const json = {
    "messageHeader": {
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
    }
  }

   var request = axios.post(constants.APP_URL + "/consultValueLog", json);
   return{
     type: constants.CONSULT_VALUE_LOGS,
     payload: request
   }
}
