import {APP_URL} from '../../constantsGlobal';
import {GET_SHAREHOLDERS_LIST_CLIENT,CHANGE_KEYWORD,CLEAR_SHAREHOLDERS,LIMITE_INF,CHANGE_PAGE} from './constants';
import axios from 'axios';

export function shareholdersByClientFindServer(pageNum,clientId,maxRows,columnOrder,order,searchTerm,shareholderKindId){
  const json = {
    "messageHeader": {
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
    "messageBody": {
       "clientId": clientId,
       "groupId":"",
       "pageNum": pageNum,
       "maxRows" : maxRows,
       "searchTerm" : searchTerm,
       "columnOrder": columnOrder,
       "order": order,
       "shareholderKindId":shareholderKindId
   }
  }

  var request = axios.post(APP_URL + "/shareholderList", json);
  return{
    type: GET_SHAREHOLDERS_LIST_CLIENT,
    payload: request
  }
}

export function changeKeyword(keyword){
  return {
    type: CHANGE_KEYWORD,
    keyword: keyword
  }
}

export function changePage(page){
  return{
    type: CHANGE_PAGE,
    currentPage: page
  }
}

export function limitiInf(limInf){
  return {
    type: LIMITE_INF,
    limInfe: limInf
  }
}

export function clearShareholder(){
    return {
        type: CLEAR_SHAREHOLDERS
    };
}
