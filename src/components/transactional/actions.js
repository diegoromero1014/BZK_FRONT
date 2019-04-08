import { SET_URL_PARAMETER } from './constants';

export function setUrlParameter(parameter, url) {

  return {
    type: SET_URL_PARAMETER,
    parameter,
    url
  }
}

export const getAllCategories = () => {
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
    "messageBody": ""
  };

  var request = axios.post(APP_URL + "/getCategoriesByRegion", json);

  return {
    type: GET_ALL_CATEGORIES,
    payload: request
  }
}

