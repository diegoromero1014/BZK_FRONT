import { APP_URL } from '../../../../constantsGlobal';
import {
  CLEAR_SHAREHOLDERS_ORDER, CLEAR_SHAREHOLDERS_CREATE, GET_SHAREHOLDERS_LIST_CLIENT, CHANGE_KEYWORD_SHAREHOLDER, CLEAR_SHAREHOLDERS,
  LIMITE_INF, CHANGE_PAGE, ORDER_COLUMN_SHAREHOLDER, CLEAR_SHAREHOLDERS_PAGINATOR, UPDATE_CERTIFICATE_NO_SHAREHOLDER
} from './constants';
import axios from 'axios';

export function shareholdersByClientFindServer(pageNum, clientId, maxRows, columnOrder, order, searchTerm, shareholderKindId, shareHolderType) {
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
      "clientId": clientId,
      "groupId": "",
      "pageNum": pageNum,
      "maxRows": maxRows,
      "searchTerm": searchTerm,
      "columnOrder": columnOrder,
      "order": order,
      "shareholderKindId": shareholderKindId,
      "shareHolderType": shareHolderType
    }
  }

  var request = axios.post(APP_URL + "/shareholderList", json);
  return {
    type: GET_SHAREHOLDERS_LIST_CLIENT,
    payload: request
  }
}

export function updateCertificateNoShareholder(valueCertificate) {
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
      "idClient": window.sessionStorage.getItem('idClientSelected'),
      "certificateNoShareholder": valueCertificate
    }
  }

  axios.post(APP_URL + "/updateCertificateNotShareholder", json);
  return {
    type: UPDATE_CERTIFICATE_NO_SHAREHOLDER,
    payload: valueCertificate
  }
}

export function changeKeywordShareholder(keywordShareholder) {
  return {
    type: CHANGE_KEYWORD_SHAREHOLDER,
    keywordShareholder: keywordShareholder
  }
}

export function changePage(page) {
  return {
    type: CHANGE_PAGE,
    currentPage: page
  }
}

export function limitiInf(limInf) {
  return {
    type: LIMITE_INF,
    limInfe: limInf
  }
}

export function clearShareholder() {
  return {
    type: CLEAR_SHAREHOLDERS
  };
}

export function clearShareholderPaginator() {
  return {
    type: CLEAR_SHAREHOLDERS_PAGINATOR
  };
}

export function clearShareholderOrder() {
  return {
    type: CLEAR_SHAREHOLDERS_ORDER
  };
}

export function clearShareholderCreate() {
  return {
    type: CLEAR_SHAREHOLDERS_CREATE
  };
}

export function orderColumnShareholder(orderShareholder, columnShareholder) {
  return {
    type: ORDER_COLUMN_SHAREHOLDER,
    orderShareholder: orderShareholder,
    columnShareholder: columnShareholder
  };
}
