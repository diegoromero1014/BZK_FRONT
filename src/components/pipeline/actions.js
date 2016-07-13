import {APP_URL} from '../../constantsGlobal';
import axios from 'axios';
import * as constants from './constants';

export function pipelineByClientFindServer(clientId, pageNum, maxRows, columnOrder, order, statusDocumentId) {
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

  var request = axios.post(APP_URL + "/listClientPipeline", json);
  return {
    type: constants.GET_PIPELINE_LIST,
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

export function clearPipeline() {
  return {
    type: constants.CLEAR_PIPELINE
  };
}

export function clearPipelinePaginator() {
  return {
    type: constants.CLEAR_PIPELINE_PAGINATOR
  };
}

export function clearPipelineOrder() {
  return {
    type: constants.CLEAR_PIPELINE_ORDER
  };
}

export function orderColumnPipeline(orderPipeline, columnPipeline) {
  return {
    type: constants.ORDER_COLUMN_PIPELINE,
    orderPipeline: orderPipeline,
    columnPipeline: columnPipeline
  };
}

export function getCsvPipelineByClient(clientId) {
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
      "clientId": clientId
    }
  }
  let request = axios.post(APP_URL + "/getCsvPipelineClient", json);
  return {
    type: constants.GET_CSV_PIPELINE_BY_CLIENT,
    payload: request
}
}

export function createEditPipeline(jsonPipeline){
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
    "messageBody": jsonPipeline
  }
  var request = axios.post(APP_URL + "/savePipeline", json);
  return{
    type: constants.CREATE_EDIT_PIPELINE,
    payload: request
  }
}
