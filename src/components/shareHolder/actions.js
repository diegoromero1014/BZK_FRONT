import {APP_URL} from '../../constantsGlobal';
import {FIND_SHAREHOLDER, KEEP_KEYWORD} from './constants';
import axios from 'axios';

export function findShareHolder(searchTerm) {
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
			"columnOrder": '',
      "order": 0,
      "pageNum": 0,
      "maxRows": 10,
      "searchTerm": searchTerm,
      "clientId": window.localStorage.getItem('idClientSeleted'),
      "groupId": 0
		}
	}

	var request = axios.post(APP_URL + "/shareholderList", json);
  	return {
    	type: FIND_SHAREHOLDER,
    	payload: request
  	}
}

/* Comentario */
export function keepKeyword(keyWord) {
  return {
    type: KEEP_KEYWORD,
    keyword: keyword
  }
}
