import {APP_URL} from '../../constantsGlobal';
import {GET_PREVISIT_LIST, CHANGE_PAGE, LIMITE_INF, CLEAR_PREVISIT_PAGINATOR, CLEAR_PREVISIT_ORDER, ORDER_COLUMN_PREVISIT, CLEAR_PREVISIT} from './constants';
import axios from 'axios';

export function pdfDescarga(idclient, idVisit){
  window.open(APP_URL + "/pdfReportVisit?idClient="+idclient+"&idPreVisit="+idVisit+"&language=es");
}

export function previsitByClientFindServer(clientId, pageNum, maxRows, columnOrder, order, statusDocumentId) {
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
  };

  var request = axios.post(APP_URL + "/listClientPrevisits", json);
  return {
    type: GET_PREVISIT_LIST,
    payload: request
  };
}

export function changePage(page) {
  return {
    type: CHANGE_PAGE,
    currentPage: page
  };
}

export function limitiInf(limInf) {
  return {
    type: LIMITE_INF,
    limInfe: limInf
  };
}

export function clearPrevisit() {
  return {
    type: CLEAR_PREVISIT
  };
}

export function clearPrevisitPaginator() {
  return {
    type: CLEAR_PREVISIT_PAGINATOR
  };
}

export function clearPrevisitOrder() {
  return {
    type: CLEAR_PREVISIT_ORDER
  };
}

export function orderColumnPrevisit(orderPrevisit, columnPrevisit) {
  return {
    type: ORDER_COLUMN_PREVISIT,
    orderPrevisit: orderPrevisit,
    columnPrevisit: columnPrevisit
  };
}
