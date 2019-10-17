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
        "P_INITIAL_DATE": moment(initialDate, 'DD/MM/YYYY').toDate().getTime(),
        "P_FINAL_DATE": moment(finalDate, 'DD/MM/YYYY').toDate().getTime()
      },
      "source": []
    }
  };

  downloadReport(payload, "/generate/XLS", name, changeStateSaveData);
}



