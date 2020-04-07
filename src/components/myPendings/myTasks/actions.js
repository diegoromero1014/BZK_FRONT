import axios from 'axios';

import { APP_URL } from '../../../constantsGlobal';
import {
  GET_INFO_USERTASK,
  UPDATE_STATUS_TASK
} from './constants';

export function getInfoTaskUser(idTask) {
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
    "messageBody": idTask
  };


  const request = axios.post(APP_URL + "/getPendingTaskById", json);
  return {
    type: GET_INFO_USERTASK,
    payload: request
  }
}

export function updateStatusTask(idTask, idStatus) {
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
      idTask: idTask,
      idStatus: idStatus
    }
  };


  const request = axios.post(APP_URL + "/updateStatusTask", json);
  return {
    type: UPDATE_STATUS_TASK,
    payload: request
  }
}
