import {APP_URL} from '../../constantsGlobal';
import {CLEAR_CONTACT_ORDER,CLEAR_CONTACT_CREAR,ORDER_COLUMN,GET_CONTACT_LIST_CLIENT,CHANGE_KEYWORD_CONTACT,CHANGE_PAGE,LIMITE_INF,CLEAR_CONTACT,CLEAR_CONTACT_PAGINATOR} from './constants';
import axios from 'axios';

export function contactsByClientFindServer(pageNum,clientId,maxRows,columnOrder,order,searchTerm,functionId,lobId,typeOfContactId){
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
       "functionId" : functionId,
       "lobId" : lobId,
       "typeOfContactId": typeOfContactId,
   }
  }

  var request = axios.post(APP_URL + "/listClientContacts", json);
  return{
    type: GET_CONTACT_LIST_CLIENT,
    payload: request
  }
}

export function downloadFilePDF(idFileDownload){
  window.open(APP_URL + "/downloadFilePDF/" + idFileDownload, '_blank', '');
}

export function changePage(page){
  return{
    type: CHANGE_PAGE,
    currentPage: page
  }
}

export function changeKeywordContact(keywordContact){
  return {
    type: CHANGE_KEYWORD_CONTACT,
    keywordContact: keywordContact
  }
}

export function limitiInf(limInf){
  return {
    type: LIMITE_INF,
    limInfe: limInf
  }
}

export function clearContact(){
    return {
        type: CLEAR_CONTACT
    };
}

export function clearContactPaginator(){
    return {
        type: CLEAR_CONTACT_PAGINATOR
    };
}

export function clearContactOrder(){
    return {
        type: CLEAR_CONTACT_ORDER
    };
}


export function clearContactCreate(){
    return {
        type: CLEAR_CONTACT_CREAR
    };
}


export function orderColumnContact(order,column){
    return {
        type: ORDER_COLUMN,
        order:order,
        column:column
    };
}
