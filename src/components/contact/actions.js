import {APP_URL} from '../../constantsGlobal';
import {GET_CONTACT_LIST_CLIENT,CHANGE_KEYWORD} from './constants';
import axios from 'axios';

export function contactsByClientFindServer(pageNum,clientId,maxRows,columnOrder,order,searchTerm){
  const json = {
    "messageHeader": {
        "sessionToken":"1B0E406EBB3D70EE6B26BC9FA0F14DFD",
        "username":"lmejias",
        "language":"es",
        "timeZone":"-5"
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
  
  var request = axios.post(APP_URL + "/listClientContacts", json);
  return{
    type: GET_CONTACT_LIST_CLIENT,
    payload: request
  }
}

export function changeKeyword(keyword){
  return{
    type: CHANGE_KEYWORD,
    keyword: keyword
  }
}
