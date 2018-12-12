import * as actions from './constants';
import axios from 'axios';
import {APP_URL, FRONT_APP} from '../../constantsGlobal';

export function toggleMenu() {
    return {
        type: actions.TOGGLE_MENU
    }
}

export function updateTitleNavBar(title){
  return {
    type: actions.UPDATE_TITLE_NAV_BAR,
    newTitle: title
  }
}

export function viewAlertClient(view){
    return {
        type: actions.VIEW_ALERT_CLIENT,
        viewAlertClient: view
    }
}

export function consultModulesAccess(){
  const json = {
      messageHeader: {
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
      messageBody: {
        "idRole": null,
        "app": FRONT_APP
      }
    }
  var request = axios.post(APP_URL + "/getModulesAccess", json);
  return {
    type: actions.CONSULT_MODULE_ACCESS,
    payload: request
  }
}
