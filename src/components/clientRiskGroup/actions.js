import { APP_URL } from '../../constantsGlobal';
import { CONSULT_RISK_GROUP } from './constants';
import axios from 'axios';

export function getClientsRiskGroup(id) {
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
    "messageBody": id
  }
  var request = axios.post(APP_URL + "/getRiskGroupByIdClient", json);
  return {
    type: CONSULT_RISK_GROUP,
    payload: request
  }
}


export function removeClientRiskGroup(id) {
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
    "messageBody": id
  }
  var request = axios.post(APP_URL + "/removeClientRiskGroup", json);
  return {
    type: CONSULT_RISK_GROUP,
    payload: request
  }
}

export function deleteRiskGroup(id) {
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
    "messageBody": id
  }
  var request = axios.post(APP_URL + "/deleteRiskGroup", json);
  return {
    type: CONSULT_RISK_GROUP,
    payload: request
  }
}


export function addClientRiskGroup(data) {
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
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      name: data.name,
      segment: data.segment
    }
  }
  var request = axios.post(APP_URL + "/addClientRiskGroup", json);
  return {
    type: CONSULT_RISK_GROUP,
    payload: request
  }
}



export function editNameRiskGroup(data) {
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
      clientId: data.clientId,
      name: data.groupName,
      notification: data.groupNotification
    }
  }
  var request = axios.post(APP_URL + "/editNameRiskgroup", json);
  return {
    type: CONSULT_RISK_GROUP,
    payload: request
  }
}
