import {APP_URL} from '../../../constantsGlobal';
import {FIND_PENDING_TASKS, LIMITE_INF, CHANGE_PAGE, CLEAR_PENDING_TASK, CLEAR_MY_PENDINGS_ORDER,
CLEAR_MY_PENDINGS_PAGINATOR, ORDER_COLUMN_MY_PENDING, GET_INFO_USERTASK, UPDATE_STATUS_TASK} from './constants';
import axios from 'axios';

export function tasksByUser(pageNum, maxRows, keyWord, orderMyPending, columnMyPending) {
  const json = {
    "messageHeader": {
      "sessionToken": window.localStorage.getItem('sessionToken'),
      "username":"",
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
      "pageNum": pageNum,
      "maxRows" : maxRows,
      "keyWord" : keyWord,
      "order" : orderMyPending,
      "columnOrder" : columnMyPending
    }
  };


  var request = axios.post(APP_URL + "/pendingTaskListByUser", json);
  return {
    type: FIND_PENDING_TASKS,
    payload: request
  }
}

export function getInfoTaskUser(idTask) {
  const json = {
    "messageHeader": {
      "sessionToken": window.localStorage.getItem('sessionToken'),
      "username":"",
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
    "messageBody": idTask
  };


  var request = axios.post(APP_URL + "/getPendingTaskById", json);
  return {
    type: GET_INFO_USERTASK,
    payload: request
  }
}

export function updateStatusTask(idTask, idStatus) {
  const json = {
    "messageHeader": {
      "sessionToken": window.localStorage.getItem('sessionToken'),
      "username":"",
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
      idTask: idTask,
      idStatus: idStatus
    }
  };


  var request = axios.post(APP_URL + "/updateStatusTask", json);
  return {
    type: UPDATE_STATUS_TASK,
    payload: request
  }
}

export function limitiInf(limInf){
  return {
    type: LIMITE_INF,
    limInfe: limInf
  }
}

export function changePage(page){
  return{
    type: CHANGE_PAGE,
    currentPage: page
  }
}

export function clearPendingTask(){
    return {
        type: CLEAR_PENDING_TASK
    };
}

export function clearMyPendingsOrder(){
    return {
        type: CLEAR_MY_PENDINGS_ORDER
    };
}

export function clearMyPendingPaginator(){
    return {
        type: CLEAR_MY_PENDINGS_PAGINATOR
    };
}

export function orderColumnMyPending(orderMyPending,columnMyPending){
    return {
        type: ORDER_COLUMN_MY_PENDING,
        orderMyPending: orderMyPending,
        columnMyPending: columnMyPending
    };
}
