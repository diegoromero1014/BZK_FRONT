import * as actions from './constants';
import axios from 'axios';
import {APP_URL} from '../../../constantsGlobal';

export function searchShareholder(typeDocument,numberDocument,clientId){
  const json = {
      messageHeader: {
        "timestamp": new Date().getTime(),
        "sessionToken": window.localStorage.getItem('sessionToken'),
         "username":"lmejias",
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
        "typeDocument": typeDocument,
        "numberDocument":numberDocument,
        "clientId": clientId
      }
    }
  var request = axios.post(APP_URL + "/getShareholderByDocument", json);
  return {
    type: actions.SEARCH_SHAREHOLDER,
    payload: request
  }
}

export function toggleModalShareholder(){
    return {
        type: actions.TOGGLE_MODAL_SHAREHOLDER
    };
}

export function clearSearchShareholder(){
    return {
        type: actions.CLEAR_SEARCH_SHAREHOLDER
    };
}
