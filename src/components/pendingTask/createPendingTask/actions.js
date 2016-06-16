import * as actions from './constants';
import axios from 'axios';
import {APP_URL} from '../../../constantsGlobal';

export function createPendingTaskNew(json){
  const jsonGlobal = {
      messageHeader: {
        "timestamp": new Date().getTime(),
        "sessionToken": window.localStorage.getItem('sessionToken'),
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
  var request = axios.post(APP_URL + "/saveUserTask", jsonGlobal);
  return {
    type: actions.CREATE_PENDING,
    payload: request
  }
}
