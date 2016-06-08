import {APP_URL} from '../../constantsGlobal';
import {CLEAR_USER_TASK_ORDER, CLEAR_USER_TASK_CREAR, ORDER_COLUMN, GET_USER_TASK_LIST_CLIENT, CHANGE_KEYWORD_USERTASK, CHANGE_PAGE, LIMITE_INF, CLEAR_USER_TASK, CLEAR_USER_TASK_PAGINATOR} from './constants';
import axios from 'axios';

export function tasksByClientFindServer(pageNum, clientId, maxRows, columnOrder, order, searchTerm) {
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
      "pageNum": pageNum,
      "maxRows" : maxRows,
      "searchTerm" : searchTerm,
      "columnOrder": columnOrder,
      "order": order
    }
  };

  var request = axios.post(APP_URL + "/pendingTaskList", json);
  return {
    type: GET_USER_TASK_LIST_CLIENT,
    payload: request
  }
}

export function downloadFileSocialStyle() {
  window.open(APP_URL + "/downloadFileSocialStyle", '_blank', '');
}

export function changePage(page) {
  return {
    type: CHANGE_PAGE,
    currentPage: page
  }
}

export function changeKeywordUserTask(keywordUserTask) {
  return {
    type: CHANGE_KEYWORD_USERTASK,
    keywordUserTask: keywordUserTask
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


export function clearUserTaskCreate() {
    return {
        type: CLEAR_USER_TASK_CREAR
    };
}


export function orderColumnUserTask(order, column) {
    return {
        type: ORDER_COLUMN,
        order:order,
        column:column
    };
}
