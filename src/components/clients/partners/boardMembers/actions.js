import axios from 'axios';
import { APP_URL } from '../../../../constantsGlobal';
import {
  CHANGE_PAGE, GET_BOARD_MEMBERS, LOWER_LIMIT, SAVE,
  CLEAR_FILTERS, CHANGE_KEYWORD
} from './constants';

export function getBoardMembers(idClient, pageNum, maxRows, searchTerm) {
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
    "messageBody": {
      "idClient": idClient,
      "pageNum": pageNum,
      "maxRows": maxRows,
      "searchTerm": searchTerm
    }
  }

  const request = axios.post(APP_URL + "/getBoardMembersByClient", json);
  return {
    type: GET_BOARD_MEMBERS,
    payload: request
  }
}

export function lowerLimit(lowerLimit) {
  return {
    type: LOWER_LIMIT,
    lowerLimit: lowerLimit
  }
}

export function changePage(page) {
  return {
    type: CHANGE_PAGE,
    currentPage: page
  }
}

export function saveBoardMember(boardMember) {
  const json = {
    messageHeader: {
      "timestamp": new Date().getTime(),
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
      "username": "lmejias",
      "service": "",
      "status": "0",
      "language": "es",
      "displayErrorMessage": "",
      "technicalErrorMessage": "",
      "applicationVersion": "",
      "debug": true,
      "isSuccessful": true
    },
    "messageBody": boardMember
  };
  const request = axios.post(APP_URL + "/saveBoardMember", json);
  return {
    type: SAVE,
    payload: request
  }
}

export function validateExistsBoardMember(boardMember) {
  const json = {
    messageHeader: {
      "timestamp": new Date().getTime(),
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
      "username": "lmejias",
      "service": "",
      "status": "0",
      "language": "es",
      "displayErrorMessage": "",
      "technicalErrorMessage": "",
      "applicationVersion": "",
      "debug": true,
      "isSuccessful": true
    },
    "messageBody": boardMember
  }
  const request = axios.post(APP_URL + "/validateBoardExist", json);
  return {
    type: SAVE,
    payload: request
  }
}

export function deleteBoardMemberByClient(idClientBoardMember) {
  const json = {
    messageHeader: {
      "timestamp": new Date().getTime(),
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
      "username": "lmejias",
      "service": "",
      "status": "0",
      "language": "es",
      "displayErrorMessage": "",
      "technicalErrorMessage": "",
      "applicationVersion": "",
      "debug": true,
      "isSuccessful": true
    },
    "messageBody": idClientBoardMember
  }
  const request = axios.post(APP_URL + "/deleteBoardMemberByClient", json);
  return {
    type: SAVE,
    payload: request
  }
}

export function clearFilters() {
  return {
    type: CLEAR_FILTERS
  }
}

export function changeKeyword(keyword) {
  return {
    type: CHANGE_KEYWORD,
    keyword: keyword
  }
}