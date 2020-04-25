import {APP_URL} from '../../constantsGlobal';
import {CONSULT_INFO_CLIENT, CHANGE_CHECK_CLIENT, CLAER_CLIENT_INFO, UPDATE_FIELD_INFO_CLIENT,
  CHANGE_VALUE_LIST_CLIENT, CHANGE_INFO_CLIENT, VALIDATE_EXPIRED_PORTFOLIO} from './constants';
import axios from 'axios';
import {downloadReport} from "../../utils"
import {changeStateSaveData} from "../main/actions"

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
  const payload = {
    messageHeader:{
      sessionToken: window.localStorage.getItem('sessionTokenFront')
    },
    messageBody: idFileDownload
  };
 
  
  downloadReport(payload, "/downloadFilePDF", "Prueba.pdf", null);
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

export function validateExpiredPortfolio(idClient) {
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
    "messageBody": idClient ? new Number(idClient) : new Number(window.sessionStorage.getItem('idClientSelected'))
  };

  var request = axios.post(APP_URL + "/alert/expiredPortfolio/client", json);

  return {
    type: VALIDATE_EXPIRED_PORTFOLIO,
    payload: request
  }
}