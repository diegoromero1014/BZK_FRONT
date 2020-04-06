import {APP_URL} from '../../../constantsGlobal';
import {FIND_DRAFT_DOCUMENTS, LIMITE_INF, CHANGE_PAGE, CLEAR_DRAFT_DOCUMENTS, CLEAR_DRAFT_DOCUMENTS_ORDER,
CLEAR_DRAFT_DOCUMENTS_PAGINATOR, ORDER_COLUMN_DRAFT_DOCUMENTS, UPDATE_MODAL_IS_OPEN} from './constants';
import axios from 'axios';

export function draftsDocumentsByUser(pageNum, maxRows, keyWord, orderDrafts, columnDrafts) {
  const json = {
    "messageHeader": {
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
      "username":"",
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
      "pageNum": pageNum,
      "maxRows" : maxRows,
      "keyWord" : keyWord,
      "order" : orderDrafts,
      "columnOrder" : columnDrafts
    }
  };


  var request = axios.post(APP_URL + "/getDraftDocuments", json);
  return {
    type: FIND_DRAFT_DOCUMENTS,
    payload: request
  }
}

export function limitiInf(limInf){
  return {
    type: LIMITE_INF,
    limInfe: limInf
  }
}

export function changePage(page){
  return{
    type: CHANGE_PAGE,
    currentPage: page
  }
}

export function clearDraftDocument(){
    return {
        type: CLEAR_DRAFT_DOCUMENTS
    };
}

export function clearDraftDocumentOrder(){
    return {
        type: CLEAR_DRAFT_DOCUMENTS_ORDER
    };
}

export function clearDraftDocumentPaginator(){
    return {
        type: CLEAR_DRAFT_DOCUMENTS_PAGINATOR
    };
}

export function orderColumnDraftDocument(orderDrafts,columnDrafts){
    return {
        type: ORDER_COLUMN_DRAFT_DOCUMENTS,
        orderDrafts: orderDrafts,
        columnDrafts: columnDrafts
    };
}


export function updateStatusModal(modalIsOpen){
  return {
    type: UPDATE_MODAL_IS_OPEN,
    modalIsOpen: modalIsOpen
  }
}
