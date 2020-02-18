import { APP_URL } from '../../constantsGlobal';
import * as constants from './constants';
import axios from 'axios';

export const filterUsersBanco = filterUser => {
  const json = {
    messageHeader: {
      "sessionToken": window.localStorage.getItem('sessionTokenFront')
    },
    messageBody: filterUser
  };
  
  return { type: constants.FILTER_USER_BANCO, payload: axios.post(APP_URL + "/findUsersByName", json) }
}

export function deleteParticipant(index, tab) {
  return {
    type: constants.DELETE_PARTICIPANT,
    index,
    tab
  };
}

export function addParticipant(participant) {
  return {
    type: constants.ADD_PARTICIPANT,
    data: participant
  };
}

export function clearParticipants() {
  return {
    type: constants.CLEAR_PARTICIPANTS
  };
}

export function addListParticipant(listParticipant) {
  return {
    type: constants.ADD_LIST_PARTICIPANT,
    listParticipant
  };
}
