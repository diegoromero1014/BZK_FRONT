import * as actions from './constants';
import axios from 'axios';
import {APP_URL} from '../../../constantsGlobal';

export function createContactNew(jsonCreateContact){
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
      messageBody: jsonCreateContact
    }
  var request = axios.post(APP_URL + "/saveContact", json);
  return {
    type: actions.CREATE_CONTACT,
    payload: request
  }
}


export function searchContact(typeDocument,numberDocument){
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
        "numberDocument":numberDocument
      }
    }
  var request = axios.post(APP_URL + "/getContactByDocument", json);
  return {
    type: actions.SEARCH_CONTACT,
    payload: request
  }
}

export function toggleModalContact(){
    return {
        type: actions.TOGGLE_MODAL_CONTACT
    };
}
