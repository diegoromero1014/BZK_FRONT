import { APP_URL } from '../../constantsGlobal';
import {
  CHANGE_PAGE,
  CLEAR_TASK,
  CLEAR_USER_TASK,
  CLEAR_USER_TASK_ORDER,
  CLEAR_USER_TASK_PAGINATOR,
  GET_USER_TASK_LIST_CLIENT,
  GET_XLS_TASK,
  LIMITE_INF,
  LOAD_PENDING,
  ORDER_COLUMN_TASK
} from './constants';
import axios from 'axios';

export function tasksByClientFindServer(pageNum, clientId, maxRows, columnOrder, order, status) {
  const json = {
    "messageHeader": {
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
      "username": "",
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
      "pageNum": pageNum,
      "maxRows": maxRows,
      "columnOrder": columnOrder,
      "order": order,
      "status": status
    }
  };


  var request = axios.post(APP_URL + "/pendingTaskList", json);
  return {
    type: GET_USER_TASK_LIST_CLIENT,
    payload: request
  }
}

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


export function clearUserTask() {
  return {
    type: CLEAR_USER_TASK
  };
}

export function clearTask() {
  return {
    type: CLEAR_TASK
  };
}


export function clearUserTaskPaginator() {
  return {
    type: CLEAR_USER_TASK_PAGINATOR
  };
}

export function clearUserTaskOrder() {
  return {
    type: CLEAR_USER_TASK_ORDER
  };
}

export function orderColumnUserTask(orderTask, columnTask) {
  return {
    type: ORDER_COLUMN_TASK,
    orderTask: orderTask,
    columnTask: columnTask
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

export function loadTaskPending(data) {
  return {
    type: LOAD_PENDING,
    data: data
  }
}

export function searchTaskPending() {
  const json = {
    "messageHeader": {
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
      "username": "",
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
      "pageNum": 0,
      "maxRows": 10,
      "section": "PENDING",
      "mode": "CLIENT",
      "filter": {
        "clientId": 5261530,
        "order": 0
      }
    }
  };

  return axios.post(APP_URL + "/getTask", json);
}