import { APP_URL } from '../../constantsGlobal';
import { CONTENT_VISOR_URL } from './constants';
import { CONTENEDOR_VISOR_URL } from '../../constantsParameters';

import axios from 'axios';

export function getContentVisorURL() {
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
      "name": CONTENEDOR_VISOR_URL
    }
  };

  var request = axios.post(APP_URL + "/getParameterByName", json);
  return {
    type: CONTENT_VISOR_URL,
    payload: request
  }
}

