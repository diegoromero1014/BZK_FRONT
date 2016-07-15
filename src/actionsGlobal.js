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
