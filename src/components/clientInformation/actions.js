import {APP_URL} from '../../constantsGlobal';
import {CONSULT_INFO_CLIENT, CHANGE_CHECK_CLIENT, FIND_ECONOMIC_GROUP, CLAER_CLIENT_INFO} from './constants';
import axios from 'axios';

export function consultInfoClient(){
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
      "clientId": window.localStorage.getItem('idClientSelected')
    }
  }

  var request = axios.post(APP_URL + "/clientInformation", json);
  return{
    type: CONSULT_INFO_CLIENT,
    payload: request
  }
}

export function downloadFilePdf(idFileDownload){
  window.open(APP_URL + "/downloadFilePDF/" + idFileDownload, '_blank', '');
}

export function clearInfoClient(){
  return {
    type: CLAER_CLIENT_INFO
  }
}

export function changeCheckInfoClient(check){
  return {
    type: CHANGE_CHECK_CLIENT,
    payload: check
  }
}
