import { APP_URL } from '../../constantsGlobal';
import {
  CLIENTS_FIND, CHANGE_PAGE, CHANGE_KEYWORD, CLEAR_CLIENTS, GET_RECENT_CLIENTS,
  DELETE_ALL_RECENT_CLIENTS, DELETE_RECENT_CLIENT, CLIENTS_FIND_TYPE_NUMBER_BASIC
} from './constants';
import axios from 'axios';

export function clientsFindServer(keyword, limInf, limSup, certificationStatus, teamId, linkingStatus, levelAEC) {
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
      "keyword": keyword,
      "limInf": limInf,
      "limSup": limSup,
      "certificationStatus": certificationStatus,
      "teamId": teamId,
      "linkingStatusus": linkingStatus,
      "levelAEC": levelAEC
    }
  };

  var request = axios.post(APP_URL + "/clientListForEmployee", json);
  return {
    type: CLIENTS_FIND,
    payload: request
  }
}

export function changePage(page) {
  return {
    type: CHANGE_PAGE,
    currentPage: page
  }
}

export function changeKeyword(keyword) {
  return {
    type: CHANGE_KEYWORD,
    keyword: keyword
  }
}

export function clearClients() {
  return {
    type: CLEAR_CLIENTS
  }
}

export function getRecentClients() {
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
    "messageBody": null
  };

  var request = axios.post(APP_URL + "/getRecentClients", json);
  return {
    type: GET_RECENT_CLIENTS,
    payload: request
  }
}

export function deleteAllRecentClients() {
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
    "messageBody": null
  };

  var request = axios.post(APP_URL + "/deleteAllRecentClients", json);
  return {
    type: DELETE_ALL_RECENT_CLIENTS,
    payload: request
  }
}

export function deleteRecentClient(idClient) {
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
    "messageBody": idClient
  };

  var request = axios.post(APP_URL + "/deleteRecentClient", json);
  return {
    type: DELETE_RECENT_CLIENT,
    payload: request
  }
}


//retorna la informacion basica del cliente
export function findClientByTypeAndNumber(data) {
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
      typeDocument: data.typeDocument,
      numberDocument: data.numberDocument
    }
  }
  var request = axios.post(APP_URL + "/getClientByDocumentTypeAndNumber", json);
  return {
    type: CLIENTS_FIND_TYPE_NUMBER_BASIC,
    payload: request
  }
}



