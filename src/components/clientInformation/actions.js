import {APP_URL} from '../../constantsGlobal';
import {CONSULT_INFO_CLIENT, CHANGE_CHECK_CLIENT, FIND_ECONOMIC_GROUP, CLAER_CLIENT_INFO, UPDATE_FIELD_INFO_CLIENT,
  CHANGE_VALUE_LIST_CLIENT, CHANGE_INFO_CLIENT} from './constants';
import axios from 'axios';

export function consultInfoClient(idClient){
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
      "clientId":  (idClient) ? idClient : window.sessionStorage.getItem('idClientSelected')
    }
  };

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

export function changeEconomicGroup(economicGroup){
  return {
    type: CHANGE_INFO_CLIENT,
    economicGroup
  }
}

export function changeCheckInfoClient(check){
  return {
    type: CHANGE_CHECK_CLIENT,
    payload: check
  }
}

export function updateFieldInfoClient(field, value) {
    return {
        type: UPDATE_FIELD_INFO_CLIENT,
        field,
        value
    }
}


export function changeValueListClient(field, list) {
    return {
        type: CHANGE_VALUE_LIST_CLIENT,
        field,
        list
    }
}