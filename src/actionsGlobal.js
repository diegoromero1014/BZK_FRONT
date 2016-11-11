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

export function nonValidateEnter(value){
  return {
    type: constants.NON_VALIDATE_ENTER,
    payload: value
  }
}

export function formValidateKeyEnter(e, validate){
  if( (e.keyCode === 13 || e.which === 13) && validate){
    e.preventDefault();
  }
}

export function validatePermissionsByModule(module){
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
      "module": module,
      "typeApp": constants.FRONT_APP
    }
  }

   var request = axios.post(constants.APP_URL + "/validatePermissionsModule", json);
   return{
     type: module,
     payload: request
   }
}
