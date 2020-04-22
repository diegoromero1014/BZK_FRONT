import {APP_URL} from '../../constantsGlobal';
import {
  CHANGE_PAGE,
  CHANGE_PAGE_FINALIZED,
  CHANGE_PAGE_PENDING,
  CLEAN_PAG_ORDER_COLUMN_FINALIZED_TASK,
  CLEAN_PAG_ORDER_COLUMN_PENDING_TASK,
  CLEAN_TEXT_TO_SEARCH,
  CLEAR_TASK,
  FINISHED,
  GET_FINALIZED_TASKS_CLIENT,
  GET_PENDING_TASKS_CLIENT,
  GET_XLS_TASK,
  LIMITE_INF,
  PENDING,
  SET_TASK_ID_FROM_REDIRECT,
  SET_TEXT_TO_SEARCH
} from "./constants";
import axios from 'axios';

export function changePage(page) {
  return {
    type: CHANGE_PAGE,
    currentPage: page
  }
}

export function limitiInf(limInf) {
  return {
    type: LIMITE_INF,
    limInfe: limInf
  }
}
export function changePagePending(page, order) {
  return {
    type: CHANGE_PAGE_PENDING,
    currentPage: page,
    order
  };
}
export function changePageFinalized(page, order) {
  return {
    type: CHANGE_PAGE_FINALIZED,
    currentPage: page,
    order
  };
}

export function clearTask() {
  return {
    type: CLEAR_TASK
  };
}

export function cleanPagAndOrderColumnPendingUserTask(orderTask){
  return {
    type: CLEAN_PAG_ORDER_COLUMN_PENDING_TASK,
    orderTask: orderTask,
  }
}
export function cleanPagAndOrderColumnFinalizedUserTask(orderTask) {
  return {
    type: CLEAN_PAG_ORDER_COLUMN_FINALIZED_TASK,
    orderTask: orderTask
  };
}

export function getXlsTask(initialDate, finalDate, states) {
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
      "initialDate": initialDate,
      "finalDate": finalDate,
      "states": states
    }
  };

  let request = axios.post(APP_URL + "/getXlsTask", json);
  return {
    type: GET_XLS_TASK,
    payload: request
  }
}

export function pendingTasksByClientPromise(pageNum, clientId, maxRows, order, textToSearch){
  const json = {
    messageHeader: {
      sessionToken: window.localStorage.getItem("sessionTokenFront"),
      username: "",
      timestamp: new Date().getTime(),
      service: "",
      status: "0",
      language: "es",
      displayErrorMessage: "",
      technicalErrorMessage: "",
      applicationVersion: "",
      debug: true,
      isSuccessful: true
    },
    messageBody: {
      pageNum,
      maxRows,
      section: PENDING,
      mode: "CLIENT",
      filter: {
        clientId,
        order,
        textToSearch
      }
    }
  };
  return axios.post(APP_URL + "/getTask", json);
}
export function finalizedTasksByClientPromise(pageNum, clientId, maxRows, order, textToSearch){
  const json = {
    messageHeader: {
      sessionToken: window.localStorage.getItem("sessionTokenFront"),
      username: "",
      timestamp: new Date().getTime(),
      service: "",
      status: "0",
      language: "es",
      displayErrorMessage: "",
      technicalErrorMessage: "",
      applicationVersion: "",
      debug: true,
      isSuccessful: true
    },
    messageBody: {
      pageNum,
      maxRows,
      section: FINISHED,
      mode: "CLIENT",
      filter: {
        clientId,
        order,
        textToSearch
      }
    }
  };
  return axios.post(APP_URL + "/getTask", json);
}
export function pendingTasksByClientFindServer(data, page, order) {
  return{
    type: GET_PENDING_TASKS_CLIENT,
    data,
    page,
    order
  }
}
export function finalizedTasksByClientFindServer(data, page, order) {
  return{
    type: GET_FINALIZED_TASKS_CLIENT,
    data,
    page,
    order
  }
}
export function setTextToSearch(textToSearch){
  return {
    type: SET_TEXT_TO_SEARCH,
    textToSearch
  };
}

export function setTaskIdFromRedirect(id){
  return {
    type: SET_TASK_ID_FROM_REDIRECT,
    id
  };
}

export function cleanTextToSearch(){
  return{
    type: CLEAN_TEXT_TO_SEARCH
  }
}