import {APP_URL} from '../../constantsGlobal';
import axios from 'axios';
import * as constants from './constants';

export function pdfDescarga(idclient, idVisit){
  window.open(APP_URL + "/pdfReportVisit?idClient="+idclient+"&idPreVisit="+idVisit+"&language=es");
}

export function createPrevisit(jsonVisit){
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
    "messageBody": jsonVisit
  }

  var request = axios.post(APP_URL + "/savePreVisit", json);
  return{
    type: constants.CREATE_PREVISIT,
    payload: request
  }
}

/*export function detailVisit(idVisit){
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
         "id": idVisit
     }
  }

  var request = axios.post(APP_URL + "/visitDocumentDetail", json);
  return{
    type: GET_DETAIL_VISIT,
    payload: request
  }
}*/
