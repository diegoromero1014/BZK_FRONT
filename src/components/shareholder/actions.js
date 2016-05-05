import {APP_URL} from '../../constantsGlobal';
import {GET_SHAREHOLDERS_LIST_CLIENT,CHANGE_KEYWORD} from './constants';
import axios from 'axios';

export function shareholdersByClientFindServer(pageNum,clientId,maxRows,columnOrder,order,searchTerm){
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
       "order": order
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
