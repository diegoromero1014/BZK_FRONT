import * as constants from './constants';
import axios from 'axios';
import { APP_URL } from '../../../constantsGlobal';

export function deleteTask(index){
  return {
      type: constants.DELETE_TASK,
      index
    };
}

export function addTask(task){
  return {
      type: constants.ADD_TASK,
      data : task
    };
}

export function editTask(task){
  return {
      type: constants.EDIT_TASK,
      data : task
    };
}

export function clearTasks(){
  return {
      type: constants.CLEAR_TASKS
    };
}

export function validateWhiteListOnTask(jsonValidateTask) {
  const jsonValidate = {
    messageHeader: {
      "timestamp": new Date().getTime(),
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
      "service": "",
      "status": "0",
      "language": "es",
      "displayErrorMessage": "",
      "technicalErrorMessage": "",
      "applicationVersion": "",
      "debug": true,
      "isSuccessful": true
    },
    messageBody: jsonValidateTask
  }
  var request = axios.post(APP_URL + "/validateWhiteListOnTask", jsonValidate);
  return {
    type: constants.VALIDATE_TASK,
    payload: request
  }
}
