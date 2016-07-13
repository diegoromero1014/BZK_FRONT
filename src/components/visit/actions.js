import {APP_URL} from '../../constantsGlobal';
import {CHANGE_IDPREVISIT,CLEAR_VISIT_PAGINATOR,CLEAR_VISIT,CLEAR_VISIT_ORDER,CLEAR_VISIT_CREATE,GET_VISIT_LIST_CLIENT,
  CHANGE_PAGE,LIMITE_INF,ORDER_COLUMN_VISIT,CONSULT_LAST_VISIT_REVIEW, CREATE_VISIT, GET_DETAIL_VISIT, PDF, OWNER_DRAFT,
  GET_CSV_VISIT_BY_CLIENT, CLEAR_IDPREVISIT } from './constants';
import axios from 'axios';

export function createVisti(jsonVisit){
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

  var request = axios.post(APP_URL + "/saveVisit", json);
  return{
    type: CREATE_VISIT,
    payload: request
  }
}

export function pdfDescarga(idclient, idVisit){
  window.open(APP_URL + "/pdfReportVisit?idClient="+idclient+"&idVisit="+idVisit+"&language=es");
}

export function visitByClientFindServer(clientId,pageNum,maxRows,columnOrder,order,statusDocumentId){
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
      "columnOrder": columnOrder,
      "order": order,
      "statusDocumentId":statusDocumentId
   }
  }

  var request = axios.post(APP_URL + "/listClientVisits", json);
  return{
    type: GET_VISIT_LIST_CLIENT,
    payload: request
  }
}

export function consultParameterServer(tagConsult){
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
      "name": tagConsult
    }
   }

   var request = axios.post(APP_URL + "/getParameterByName", json);
   return{
     type: CONSULT_LAST_VISIT_REVIEW,
     payload: request
   }
}

export function changePage(page){
  return{
    type: CHANGE_PAGE,
    currentPage: page
  }
}

export function changeIdPrevisit(idPrevisit){
  return{
    type: CHANGE_IDPREVISIT,
    idPrevisit: idPrevisit
  }
}

export function clearIdPrevisit(){
  return{
    type: CLEAR_IDPREVISIT
  }
}

export function limitiInf(limInf){
  return {
    type: LIMITE_INF,
    limInfe: limInf
  }
}

export function clearVisit(){
  return {
    type: CLEAR_VISIT
  };
}

export function clearVisitPaginator(){
  return {
    type: CLEAR_VISIT_PAGINATOR
  };
}

export function clearVisitOrder(){
  return {
    type: CLEAR_VISIT_ORDER
  };
}

export function orderColumnVisit(orderVisit,columnVisit){
  return {
    type: ORDER_COLUMN_VISIT,
    orderVisit:orderVisit,
    columnVisit:columnVisit
  };
}

export function detailVisit(idVisit){
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
}

export function changeOwnerDraft(ownerDraft){
  return {
    type: OWNER_DRAFT,
    ownerDraft: ownerDraft
  };
}

export function getCsvVisitsByClient(clientId, hasParticipatingContacts, hasParticipatingEmployees, hasRelatedEmployees) {
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
      "hasParticipatingContacts":  hasParticipatingContacts,
      "hasParticipatingEmployees": hasParticipatingEmployees,
      "hasRelatedEmployees": hasRelatedEmployees
    }
  };
  let request = axios.post(APP_URL + "/getCsvVisitsByClient", json);
  return {
    type: GET_CSV_VISIT_BY_CLIENT,
    payload: request
  };
}
