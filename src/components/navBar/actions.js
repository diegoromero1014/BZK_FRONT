import * as actions from './constants';
import axios from 'axios';
import {APP_URL, FRONT_APP} from '../../constantsGlobal';

import {catchAction} from '../../utils/catchRequest'

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
        "idRole": null,
        "app": FRONT_APP
  }
  return catchAction(json, '/getModulesAccess', actions.CONSULT_MODULE_ACCESS, "");
}


export function showBrandConfidential(confidential) {
  return {
    type: actions.SHOW_BRAND_CONFIDENTIAL,
    payload: confidential
  }
}