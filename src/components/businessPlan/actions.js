import {APP_URL} from '../../constantsGlobal';
import axios from 'axios';
import * as constants from './constants';

export function businessPlanByClientFindServer(clientId, pageNum, maxRows, columnOrder, order, statusDocumentId, businessStatus) {
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
  var request = axios.post(APP_URL + "/listClientBusinessPlan", json);
  return {
    type: constants.GET_BUSINESS_PLAN_LIST,
    payload: request
  };
}


export function changePage(page) {
  return {
    type: constants.CHANGE_PAGE,
    currentPage: page
  };
}

export function limitiInf(limInf) {
  return {
    type: constants.LIMITE_INF,
    limInfe: limInf
  };
}

export function clearBusinessPlan() {
  return {
    type: constants.CLEAR_BUSINESS_PLAN
  };
}

export function clearBusinessPlanPaginator() {
  return {
    type: constants.CLEAR_BUSINESS_PLAN_PAGINATOR
  };
}

export function clearBusinessPlanOrder() {
  return {
    type: constants.CLEAR_BUSINESS_PLAN_ORDER
  };
}

export function orderColumnBusinessPlan(orderBusinessPlan, columnBusinessPlan) {
  return {
    type: constants.ORDER_COLUMN_BUSINESS_PLAN,
    orderBusinessPlan: orderBusinessPlan,
    columnBusinessPlan: columnBusinessPlan
  };
}
