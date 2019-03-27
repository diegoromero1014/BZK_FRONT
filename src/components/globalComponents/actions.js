import _ from 'lodash';
import Router from '../../historyRouter';
import axios from 'axios';
import { APP_URL } from '../../constantsGlobal';
import * as constants from './constants';

const productionUse = process.env.NODE_ENV === 'production';

export function redirectUrl(url) {
  const urlToPush = _.startsWith(url, '/') && productionUse ? url.substr(1) : url;
  Router.push(urlToPush);
  return {
    sessionToken: url
  }
}

export function goBack() {
  Router.goBack();
}

export function shorterStringValue(element) {
  return element.length > 50 ? element.substring(0, 50) + "..." : element;
}

export function mapDateValueFromTask(date) {
  if (moment(date, [REVIEWED_DATE_FORMAT], 'es', true).isValid()) {
    return date;
  } else {
    return moment(date).locale('es').format(REVIEWED_DATE_FORMAT);
  }
}

export function filterUsers(filterUser) {
  const json = {
    messageHeader: {
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
    messageBody: filterUser
  };
  var request = axios.post(APP_URL + "/findUsersByName", json);
  return {
    type: constants.FILTER_USER,
    payload: request
  }
}

export function clearUsers() {
  return {
    type: constants.CLEAR_USER
  };
}

export function addUsers(userPermission) {
  return {
    type: constants.ADD_USER,
    data: userPermission
  };
}

export function deleteUser(index, tab) {
  return {
    type: constants.DELETE_USER,
    index,
    tab
  };
}
