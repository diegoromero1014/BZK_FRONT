import {APP_URL} from '../../constantsGlobal';
import axios from 'axios';
import {TAB_SELETED_ACTIVE, GET_CSV,CONSULT_PIPELINE, CONSULT_PREVISIT,CONSULT_VISIT, LOAD_CHART, 
  CONSULT_BUSINESS_PLANS, CHANGE_ERROR_YEAR} from './constants';
export function changeTabSeletedChartView(tabSeleted){
  return{
    type: TAB_SELETED_ACTIVE,
    tabSeleted: tabSeleted
  }
}

export function changeLoadChart(loadChart){
  return{
    type: LOAD_CHART,
    loadChart: loadChart
  }
}

export function changeErrorYearSeleted(value){
  return{
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



