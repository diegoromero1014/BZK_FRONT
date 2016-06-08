import {APP_URL} from '../../constantsGlobal';
import {CLEAR_VISIT_PAGINATOR,CLEAR_VISIT,CLEAR_VISIT_ORDER,CLEAR_VISIT_CREATE,GET_VISIT_LIST_CLIENT,
  CHANGE_PAGE,LIMITE_INF,ORDER_COLUMN_VISIT,CONSULT_LAST_VISIT_REVIEW, CREATE_VISIT} from './constants';
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
