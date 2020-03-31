import { APP_URL } from '../../constantsGlobal';
import axios from 'axios';
import { TAB_SELETED_ACTIVE, GET_CSV, LOAD_CHART, CHANGE_ERROR_YEAR } from './constants';
import { downloadReport } from "../../utils";
import moment from "moment";

export function changeTabSeletedChartView(tabSeleted) {
    return {
        type: TAB_SELETED_ACTIVE,
        tabSeleted: tabSeleted
    }
}

export function changeErrorYearSeleted(value) {
    return {
        type: CHANGE_ERROR_YEAR,
        value: value
    }
}

export function getCsv(year,url, hasParticipatingContacts, hasParticipatingEmployees, hasRelatedEmployees) {
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
      "year": year,
      "hasParticipatingContacts":  hasParticipatingContacts,
      "hasParticipatingEmployees": hasParticipatingEmployees,
      "hasRelatedEmployees": hasRelatedEmployees
    }
  }
  let request = axios.post(APP_URL + url, json);
  return {
    type: GET_CSV,
    payload: request
  }
}

export function getPipelineXls(initialDate, finalDate, changeStateSaveData) {
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
      "initialDate": moment(initialDate, 'DD/MM/YYYY').toDate().getTime(),
      "finalDate": moment(finalDate, 'DD/MM/YYYY').toDate().getTime()
    }
  };

  downloadReport(payload, "/getPipelineXls", name, changeStateSaveData);
}





