import {APP_URL} from '../../constantsGlobal';
import axios from 'axios';
import {TAB_SELETED_ACTIVE, GET_CSV, LOAD_CHART, CHANGE_ERROR_YEAR} from './constants';
import {downloadReport} from "../../utils";
import moment from "moment";

export function changeTabSeletedChartView(tabSeleted) {
    return {
        type: TAB_SELETED_ACTIVE,
        tabSeleted: tabSeleted
    }
}

export function changeLoadChart(loadChart) {
    return {
        type: LOAD_CHART,
        loadChart: loadChart
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

export function getPipelineXls(initialDate, finalDate) {
  let url = "/getPipelineXls";
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
      "initialDate": moment(initialDate, 'DD/MM/YYYY').toDate().getTime(),
      "finalDate": moment(finalDate, 'DD/MM/YYYY').toDate().getTime()
    }
  };
  let request = axios.post(APP_URL + url, json);
  return {
    type: GET_CSV,
    payload: request
  }
}

export function getXlsPipeline(changeStateSaveData, request) {
  const name = "Pipeline vista gerencial.xls";

  request = request.map(
      value => Object.assign(value, { createDate: moment(value.createDate).format("DD/MM/YYYY"), updateDate: moment(value.updateDate).format('DD/MM/YYYY')})
  );

  debugger;
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
      "route": "BiztrackReports/PipelineGerencialView.jrxml",
      "params": {},
      "source": request
    }
  };

  downloadReport(payload, "/generate/XLS", name, changeStateSaveData);
}



