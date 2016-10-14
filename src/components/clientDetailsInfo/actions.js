import {APP_URL} from '../../constantsGlobal';
import {UPDATE_ACTIVE_TAB, CLICK_BUTTON_UPDATE_EDIT, VALIDATE_CONTACT_SHAREHOLDER, UPDATE_CLIENT,
      CHANGE_VALUE_MODAL_ERRORS, MESSAGE_ERRORS_UPDATE} from './constants';
import axios from 'axios';

export function updateTabSeleted( tabActive ){
  return {
    type: UPDATE_ACTIVE_TAB,
    payload: tabActive
  }
}

export function seletedButton( idButton ){
  return {
    type: CLICK_BUTTON_UPDATE_EDIT,
    payload: idButton
  }
}

export function showHideModalErros( value ){
  return {
    type: CHANGE_VALUE_MODAL_ERRORS,
    payload: value
  }
}

export function sendErrorsUpdate( erros ){
  return {
    type: MESSAGE_ERRORS_UPDATE,
    payload: erros
  }
}

export function validateContactShareholder(){
  const json = {
    "messageHeader":{
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
    "messageBody": window.localStorage.getItem('idClientSelected')
  }

  var request = axios.post(APP_URL + "/validateInfoClient", json);
  return{
    type: VALIDATE_CONTACT_SHAREHOLDER,
    payload: request
  }
}

export function updateClient(){
  const json = {
    "messageHeader":{
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
    "messageBody": window.localStorage.getItem('idClientSelected')
  }

  var request = axios.post(APP_URL + "/updateDataClient", json);
  return{
    type: UPDATE_CLIENT,
    payload: request
  }
}
