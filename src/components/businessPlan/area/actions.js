import * as constants from './constants';
import { APP_URL } from '../../../constantsGlobal';
import axios from 'axios';

export function deleteArea(index){
  return {
      type: constants.DELETE_AREA,
      index
    };
}

export function addArea(area){
  return {
      type: constants.ADD_AREA,
      data : area
    };
}

export function editArea(area){
  return {
      type: constants.EDIT_AREA,
      data : area
    };
}

export function clearArea(){
  return {
      type: constants.CLEAR_AREA
    };
}

export function validateWhiteListOnArea(jsonValidateArea) {
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
    messageBody: jsonValidateArea
  }
  var request = axios.post(APP_URL + "/validateWhiteListOnArea", jsonValidate);
  return {
    type: constants.VALIDATE_AREA,
    payload: request
  }
}