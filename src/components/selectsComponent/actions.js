import {APP_URL} from '../../constantsGlobal';
import axios from 'axios';
import {FILTER_MULTISELECT_FIELDS, CLEAR_VALUES_COUNTRY} from './constants';

export function consultDataSelect(field){
  const json = {
      messageHeader: {
        "timestamp": new Date().getTime(),
        "sessionToken": window.localStorage.getItem('sessionToken'),
        "service": "",
        "status": "0",
        "language": "es",
        "displayErrorMessage": "",
        "technicalErrorMessage": "",
        "applicationVersion": "",
        "debug": true,
        "isSuccessful": true
      },
      messageBody: {
        "field": field
      }
    };
  var request = axios.post(APP_URL + "/masterDataByField", json);
  return {
    type: field,
    payload: request
  }
}

export function consultList(field){
  const json = {
      messageHeader: {
        "timestamp": new Date().getTime(),
        "sessionToken": window.localStorage.getItem('sessionToken'),
        "service": "",
        "status": "0",
        "language": "es",
        "displayErrorMessage": "",
        "technicalErrorMessage": "",
        "applicationVersion": "",
        "debug": true,
        "isSuccessful": true
      },
      messageBody: {
      }
    }
  var request = axios.post(APP_URL + "/" + field, json);
  return {
    type: field,
    payload: request
  }
}

export function consultListWithParameter(field, parentId){
  const json = {
      messageHeader: {
        "timestamp": new Date().getTime(),
        "sessionToken": window.localStorage.getItem('sessionToken'),
        "service": "",
        "status": "0",
        "language": "es",
        "displayErrorMessage": "",
        "technicalErrorMessage": "",
        "applicationVersion": "",
        "debug": true,
        "isSuccessful": true
      },
      messageBody: {
        "parentId": parentId
      }
    }
  var request = axios.post(APP_URL + "/" + field, json);
  return {
    type: field,
    payload: request
  }
}

export function consultListWithParameterUbication(field, parentId){
  const json = {
      messageHeader: {
        "timestamp": new Date().getTime(),
        "sessionToken": window.localStorage.getItem('sessionToken'),
        "service": "",
        "status": "0",
        "language": "es",
        "displayErrorMessage": "",
        "technicalErrorMessage": "",
        "applicationVersion": "",
        "debug": true,
        "isSuccessful": true
      },
      messageBody: {
        "parentId": parentId
      }
    }
  var request = axios.post(APP_URL + "/masterDataByParentId", json);
  return {
    type: field,
    payload: request
  }
}

/**
 * @param fields lista de nombres de las listas que se quieren consultar
 */
export function getMasterDataFields(fields) {
  const json = {
    messageHeader: {
      "timestamp": new Date().getTime(),
      "sessionToken": window.localStorage.getItem('sessionToken'),
      "service": "",
      "status": "0",
      "language": "es",
      "displayErrorMessage": "",
      "technicalErrorMessage": "",
      "applicationVersion": "",
      "debug": true,
      "isSuccessful": true
    },
    messageBody: {
      "fields": fields
    }
  }

  var request = axios.post(APP_URL + "/masterDataByFields", json);

  return {
    type: FILTER_MULTISELECT_FIELDS,
    payload: request
  }
}

export function clearValuesAdressess(){
  return {
    type: CLEAR_VALUES_COUNTRY
  }
}
