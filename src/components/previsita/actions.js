import { APP_URL, NAME_REPORT_PREVISIT } from '../../constantsGlobal';
import axios from 'axios';
import * as constants from './constants';
import { generatePDF } from '../reports/pdf/actions';
import { validateIsNullOrUndefined } from '../../actionsGlobal';

export function pdfDescarga(changeStateSaveData, idPrevisit) {
    const requestBody = {
      "name": "reportPreVisit.pdf",
      "route": "BiztrackReports/reportPreVisit.jrxml",
      "params": {
        "P_ID_PREVISIT": Number(idPrevisit)
      },
      "source": []
    };
  generatePDF(changeStateSaveData, requestBody);
 }

export function createPrevisit(jsonVisit) {
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
    "messageBody": jsonVisit
  }
  var request = axios.post(APP_URL + "/savePreVisit", json);
  return {
    type: constants.CREATE_PREVISIT,
    payload: request
  }
}

export function previsitByClientFindServer(clientId, pageNum, maxRows, columnOrder, order, statusDocumentId, consultAsocietePrevisit) {
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
      "columnOrder": columnOrder,
      "order": order,
      "statusDocumentId": statusDocumentId,
      "consultAsocietePrevisit": !validateIsNullOrUndefined(consultAsocietePrevisit) ? consultAsocietePrevisit : false
    }
  };

  var request = axios.post(APP_URL + "/listClientPrevisits", json);
  return {
    type: constants.GET_PREVISIT_LIST,
    payload: request
  };
}

export function changePage(page) {
  return {
    type: constants.CHANGE_PAGE,
    currentPage: page
  };
}

export function limitiInf(limInf) {
  return {
    type: constants.LIMITE_INF,
    limInfe: limInf
  };
}

export function clearPrevisit() {
  return {
    type: constants.CLEAR_PREVISIT
  };
}

export function clearPrevisitPaginator() {
  return {
    type: constants.CLEAR_PREVISIT_PAGINATOR
  };
}

export function clearPrevisitOrder() {
  return {
    type: constants.CLEAR_PREVISIT_ORDER
  };
}

export function changeOwnerDraftPrevisit(ownerDraft) {
  return {
    type: constants.OWNER_DRAFT,
    ownerDraft: ownerDraft
  };
}

export function orderColumnPrevisit(orderPrevisit, columnPrevisit) {
  return {
    type: constants.ORDER_COLUMN_PREVISIT,
    orderPrevisit: orderPrevisit,
    columnPrevisit: columnPrevisit
  };
}

export function detailPrevisit(idPrevisit) {
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
      "id": idPrevisit
    }
  }

  var request = axios.post(APP_URL + "/preVisitDocumentDetail", json);
  return {
    type: constants.GET_DETAIL_PREVISIT,
    payload: request
  }
}

export function clearPrevisitDetail(){
  return {
    type: constants.CLEAR_PREVISIT_DETAIL
  };
}

export function getCsvPreVisitsByClient(clientId, hasParticipatingContacts, hasParticipatingEmployees, hasRelatedEmployees) {
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
      "hasParticipatingContacts": hasParticipatingContacts,
      "hasParticipatingEmployees": hasParticipatingEmployees,
      "hasRelatedEmployees": hasRelatedEmployees
    }
  };
  let request = axios.post(APP_URL + "/getCsvPreVisitsByClient", json);
  return {
    type: constants.GET_CSV_PREVISIT_BY_CLIENT,
    payload: request
  };
}

export function validateDatePreVisit(startDate, finalDate, id){

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
      "userName": window.localStorage.getItem('userNameFront'),
      "initialDate": startDate,
      "endDate": finalDate,
      "idPreVisit": id
    }
  };
  let request = axios.post(APP_URL + "/validateDatePrevisit", json);
  return{
    type: constants.CREATE_PREVISIT,
    payload: request
  };
}


// Consultar si puedo editar previsita

export function canEditPrevisita(idPrevisit) {
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
      "client_id": window.sessionStorage.getItem('idClientSelected'),
      "username": window.localStorage.getItem('userNameFront'),
      "report_id": idPrevisit,
      "report_type": NAME_REPORT_PREVISIT
    }
      
  }

  let request = axios.post(APP_URL+'/getUserBlockingReport', json);
  
  return{
      type: constants.ASK_EDIT_PREVISITA,
      payload: request
  };
}

export function disableBlockedReport (idPrevisit) {

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
      "client_id": window.sessionStorage.getItem('idClientSelected'),
      "username": window.localStorage.getItem('userNameFront'),
      "report_id": idPrevisit,
      "report_type": NAME_REPORT_PREVISIT
    }
      
  }

  let request = axios.post(APP_URL+'/deleteBlockedReport', json);

  return {
    type: constants.DELETE_BLOCKED_PREVISITA,
    payload: request
  };

}




