import {APP_URL} from '../../constantsGlobal';
import {CLIENTS_FIND, CHANGE_PAGE, CHANGE_KEYWORD, CLEAR_CLIENTS} from './constants';
import axios from 'axios';

export function clientsFindServer(keyword, limInf, limSup,certificationStatus,teamId,linkingStatusus){
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
    "messageBody":{
      "keyword": keyword,
      "limInf": limInf,
      "limSup": limSup,
      "certificationStatus": certificationStatus,
      "teamId" : teamId,
      "linkingStatusus":linkingStatusus
    }
  };

  var request = axios.post(APP_URL + "/clientListForEmployee", json);
  return{
    type: CLIENTS_FIND,
    payload: request
  }
}

export function changePage(page){
  return{
    type: CHANGE_PAGE,
    currentPage: page
  }
}

export function changeKeyword(keyword){
  return{
    type: CHANGE_KEYWORD,
    keyword: keyword
  }
}

export function clearClients(){
  return {
    type: CLEAR_CLIENTS
  }
}
