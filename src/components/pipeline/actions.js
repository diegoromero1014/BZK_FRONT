import axios from 'axios';

import { APP_URL } from '../../constantsGlobal';
import * as constants from './constants';
import { downloadReport } from '../../utils';
import { generatePDF } from '../reports/pdf/actions';

export function pipelineByClientFindServer(clientId, pageNum, maxRows, columnOrder, order, statusDocumentId, pipelineStatus) {
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
      "pipelineStatus": pipelineStatus
    }
  };

  var request = axios.post(APP_URL + "/listClientPipeline", json);
  return {
    type: constants.GET_PIPELINE_LIST,
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

export function clearPipeline() {
  return {
    type: constants.CLEAR_PIPELINE
  };
}

export function clearPipelinePaginator() {
  return {
    type: constants.CLEAR_PIPELINE_PAGINATOR
  };
}

export function clearPipelineOrder() {
  return {
    type: constants.CLEAR_PIPELINE_ORDER
  };
}

export function orderColumnPipeline(orderPipeline, columnPipeline) {
  return {
    type: constants.ORDER_COLUMN_PIPELINE,
    orderPipeline: orderPipeline,
    columnPipeline: columnPipeline
  };
}

export function getCsvPipelineByClient(changeStateSaveData, clientId) {
  const name = "Pipeline.xlsx";

  const payload = {
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
        "name": name,
        "route": "BiztrackReports/PIPELINE_BY_CLIENT.jrxml",
        "params": {
          "P_ID_CLIENT": Number(clientId)
        },
        "source": []
    }
  };

  downloadReport(payload, "/generate/XLSX", name, changeStateSaveData);
}

export function createEditPipeline(jsonPipeline) {
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
    "messageBody": jsonPipeline
  }

  var request = axios.post(APP_URL + "/savePipeline", json);
  return {
    type: constants.CREATE_EDIT_PIPELINE,
    payload: request
  }
}

export function getPipelineById(pipelineId) {
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
      "id": pipelineId
    }
  };
  let request = axios.post(APP_URL + "/pipelineDetails", json);
  return {
    type: constants.GET_PIPELINE,
    payload: request
  };
}

export function pdfDescarga(changeStateSaveData, idPipeline) {  
  const requestBody = {
    "name": "Pipeline.pdf",
    "route": "BiztrackReports/pipeline2.jrxml",
    "params": {
      "P_ID_PIPELINE": Number(idPipeline)
    },
    "source": []
  }
  generatePDF(changeStateSaveData, requestBody);
}

export function changeOwnerDraftPipeline(ownerDraft) {
  return {
    type: constants.OWNER_DRAFT,
    ownerDraft: ownerDraft
  };
}

export function updateDisbursementPlans(listDisbursementPlans, origin) {
  return {
    type: constants.UPDATE_DISBURSEMENT_PLANS,
    listDisbursementPlans: listDisbursementPlans,
    origin
  };
}

export function setOpenPipelineChild(value) {
  return {
    type: constants.SET_OPEN_PIPELINE_CHILD,
    value
  }
}

export function changeMainPipeline(value) {
  return {
    type: constants.CHANGE_MAIN_PIPELINE,
    value
  }
}
