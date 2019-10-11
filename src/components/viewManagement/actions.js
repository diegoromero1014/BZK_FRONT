import {APP_URL} from '../../constantsGlobal';
import axios from 'axios';
import {TAB_SELETED_ACTIVE, GET_CSV, LOAD_CHART, CHANGE_ERROR_YEAR} from './constants';
import {downloadReport} from "../../utils";

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

export function getXlsPipeline(changeStateSaveData, initialDate, finalDate) {
  const name = "Pipeline vista gerencial.xls";

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
      "route": "BiztrackReports/pipeline_view_manager.jrxml",
      "params": {
        "P_USER_NAME": window.localStorage.getItem("userNameFront"),
        "P_INITIAL_DATE": initialDate,
        "P_FINAL_DATE": finalDate
      },
      "source": []
    }
  };

  downloadReport(payload, "/generate/XLS", name, changeStateSaveData);
}



