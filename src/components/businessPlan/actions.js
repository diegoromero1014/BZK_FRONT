import {APP_URL} from '../../constantsGlobal';
import axios from 'axios';
import * as constants from './constants';
import { generatePDF } from '../reports/pdf/actions';

export function businessPlanByClientFindServer(clientId, pageNum, maxRows, columnOrder, order, statusDocumentId, businessStatus) {
  const json = {
    "messageHeader": {
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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

export function createBusiness(jsonBusiness){
  const json = {
    "messageHeader": {
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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
    "messageBody": jsonBusiness
  }

  var request = axios.post(APP_URL + "/saveBusinessPlan", json);
  return{
    type: constants.CREATE_BUSINESS,
    payload: request
  }
}


export function detailBusiness(idBusiness){
  const json = {
    "messageHeader": {
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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
       "id": idBusiness
     }
}
var request = axios.post(APP_URL + "/businessDetail", json);
  return{
    type: constants.GET_DETAIL_BUSINESS,
    payload: request
  }
}

export function getCsvBusinessPlanByClient(clientId, haveNeeds) {
  const json = {
    "messageHeader": {
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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
        "haveNeeds": haveNeeds
     }
  }
  let request = axios.post(APP_URL + "/getCsvBusinessPlanClient", json);
  return {
    type: constants.GET_CSV_BUSINESS_PLAN_BY_CLIENT,
    payload: request
  }
}

export function getCsvBusinessPlan(year, haveNeeds) {
  const json = {
    "messageHeader": {
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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
        "year": year,
        "haveNeeds": haveNeeds
     }
  }
  let request = axios.post(APP_URL + "/getCsvBusinessPlan", json);
  return {
    type: constants.GET_CSV_BUSINESS_PLAN,
    payload: request
  }
}

export function pdfDescarga(changeStateSaveData, businessPlanId) {
  const requestBody = {
    "name": "ReportBusinessPlan.pdf",
    "route": "BiztrackReports/ReportBusinessPlan.jrxml",
    "params": {
      "P_ID_BUSINESS_PLAN": Number(businessPlanId)
    },
    "source": []
  };
  generatePDF(changeStateSaveData, requestBody);
}

export function validateRangeDates(startDate, endDate, idBusinessPlan){
  const json = {
    "messageHeader": {
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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
      "idClient": window.sessionStorage.getItem('idClientSelected'),
      "idBusinessPlan": idBusinessPlan,
      "initialDate": startDate,
      "finalDate": endDate
    }
  }

  var request = axios.post(APP_URL + "/validateDatesInBusinessPlan", json);
  return{
    type: constants.CREATE_BUSINESS,
    payload: request
  }
}