import { APP_URL } from '../../constantsGlobal';
import {
  CONSULT_RISK_GROUP,
  REMOVE_CLIENT_RISK_GROUP, DELETE_RISK_GROUP, ADD_CLIENT_RISK_GROUP, EDIT_NAME_RISK_GROUP, HAS_RISK_GROUP
} from './constants';
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


export function removeClientRiskGroup(data) {
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
    "messageBody": data
  }
  var request = axios.post(APP_URL + "/requestRemoveClientRiskGroup", json);
  return {
    type: REMOVE_CLIENT_RISK_GROUP,
    payload: request
  }
}

export function deleteRiskGroup(data) {
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
    "messageBody": data
  }
  var request = axios.post(APP_URL + "/requestDeleteRiskGroup", json);
  return {
    type: DELETE_RISK_GROUP,
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
      idClient: data.idClient,
      documentTypeId: data.documentTypeId,
      documentNumber: data.documentNumber,
      clientName: data.clientName,
      segmentClientId: data.segmentClientId,
      conformationReasonId: data.conformationReasonId,
      riskGroupId: data.riskGroupId,
      justification: data.justification
    }
  }
  var request = axios.post(APP_URL + "/requestAddClientRiskGroup", json);
  return {
    type: ADD_CLIENT_RISK_GROUP,
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
    "messageBody": data
  }
  var request = axios.post(APP_URL + "/editNameRiskgroup", json);
  return {
    type: EDIT_NAME_RISK_GROUP,
    payload: request
  }
}

export function hasClientRequest(id) {
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
  var request = axios.post(APP_URL + "/clientHasGroup", json);
  return {
    type: HAS_RISK_GROUP,
    payload: request
  }
}
