import {
  SAVE_DATA_LOADING,
  PRODUCTION_UPGRADE_REQUEST,
  PRODUCTION_UPGRADE_NOTIFIED,
  VALID_TOKEN,
  CHANGE_MENU_ACTIVE,
  CHANGE_MENU_DESACTIVE
} from './constants';

import axios from 'axios';
import { APP_URL } from '../../constantsGlobal';

export function changeStateSaveData(value, message) {
  return {
    type: SAVE_DATA_LOADING,
    value: value,
    message: message
  }
}


export function validateUpgrateProductionActive() {
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
    "messageBody": ""
  };
  var request = axios.post(APP_URL + "/upgradeProductionEnabled", json);

  return {
    type: PRODUCTION_UPGRADE_REQUEST,
    payload: request
  }
}

export function notifiedProductionUpgrade() {
  return {
    type: PRODUCTION_UPGRADE_NOTIFIED
  }
}

export function changeStatusMenuAct(){
  return{
    type: CHANGE_MENU_ACTIVE
  }
}


export function changeStatusMenuDes(){
  return{
    type: CHANGE_MENU_DESACTIVE
  }
}

export function changeTokenStatus(status) {
  return {
    type: VALID_TOKEN,
    value: status
  }
}
