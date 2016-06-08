import {APP_URL} from '../../constantsGlobal';
import * as constants from './constants';
import axios from 'axios';

export function filterUsersBanco(filterUser){
  const json = {
      messageHeader: {
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
      messageBody: filterUser
    }
  var request = axios.post(APP_URL + "/findUsersByName", json);
  return {
    type: constants.FILTER_USER_BANCO,
    payload: request
  }
}

export function deleteParticipant(index){
  return {
      type: constants.DELETE_PARTICIPANT,
      index
    };
}

export function addParticipant(participant){
  return {
      type: constants.ADD_PARTICIPANT,
      data : participant
    };
}

export function clearParticipants(){
  return {
      type: constants.CLEAR_PARTICIPANTS
    };
}
