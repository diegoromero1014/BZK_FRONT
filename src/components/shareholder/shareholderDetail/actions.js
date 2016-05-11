import {APP_URL} from '../../../constantsGlobal';
import {SHARE_HOLDER_DETAIL} from './constants';
import axios from 'axios';

export function getDetailShareHolder(idShareHolder){
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
      "id": idShareHolder
    }
  }

  var request = axios.post(APP_URL + "/shareholderDetails", json);
  return{
    type: SHARE_HOLDER_DETAIL,
    payload: request
  }
}
