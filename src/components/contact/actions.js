import {APP_URL} from '../../constantsGlobal';
import {GET_CONTACT_LIST_CLIENT, CHANGE_KEYWORD, GET_CONTACT_DETAILS} from './constants';
import axios from 'axios';

export function contactsByClientFindServer(pageNum,clientId,maxRows,columnOrder,order,searchTerm){
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
       "clientId": clientId,
       "groupId":"",
       "pageNum": pageNum,
       "maxRows" : maxRows,
       "searchTerm" : searchTerm,
       "columnOrder": columnOrder,
       "order": order,
       "functionId" : "",
       "lobId" : "",
       "typeOfContactId": "",
   }
  }

  var request = axios.post(APP_URL + "/listClientContacts", json);
  return{
    type: GET_CONTACT_LIST_CLIENT,
    payload: request
  }
}

export function changeKeyword(keyword){
  return{
    type: CHANGE_KEYWORD,
    keyword: keyword
  }
}

/**
 * Metodo para llamar al servicio y traer la informacion del contacto por su identficacion
 * @param contactId
 */
export function getContactDetails(contactId) {
  const json = {
    messageHeader: {
      sessionToken: window.localStorage.getItem('sessionToken'),
      timestamp: new Date().getTime(),
      service: '',
      status: 0,
      language: 'es',
      displayErrorMessage: '',
      technicalErrorMessage: '',
      applicationVersion: '',
      debug: true,
      isSuccessful: true
    },
    messageBody: {
      contactId: windowlocalStorage.getItem('contactId')
    }
  }

  var request = axios.post(APP_URL, '/getContactDetails', json);

  return {
    type: GET_CONTACT_DETAILS,
    payload: request
  }
}