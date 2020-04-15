import * as actions from './constants';
import axios from 'axios';
import {APP_URL} from '../../../constantsGlobal';
import {CREATE_COMMENT, GET_COMMENTS_BY_REPORT_ID} from "../../globalComponents/comments/constants";
import moment from "moment";

export function createPendingTaskNew(json){
  const jsonCreate = {
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
      messageBody: json
    }
  var request = axios.post(APP_URL + "/saveUserTask", jsonCreate);
  return {
    type: actions.CREATE_PENDING,
    payload: request
  }
}

export function saveTaskNote(note){
  note.id = null;
  note.createdTimestamp = moment(note.createdTimestamp).valueOf();
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
    "messageBody": note
  };
  const request = axios.post(APP_URL + "/saveTaskNote", json);
  return {
    type: CREATE_COMMENT,
    payload: request
  }
}

export function getTaskNotesByUserTaskId(userTaskId){
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
    "messageBody": userTaskId
  };
  const request = axios.post(APP_URL + "/getTaskNotesByUserTaskId", json);
  return {
    type: GET_COMMENTS_BY_REPORT_ID,
    payload: request
  }
}
