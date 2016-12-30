import {APP_URL} from '../../constantsGlobal';
import axios from 'axios';
import {TAB_SELETED_ACTIVE, GET_CSV,CONSULT_PIPELINE, CONSULT_PREVISIT,CONSULT_VISIT,CONSULT_CURRENCY, LOAD_CHART, 
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


export function consultInformationPipeline(idStatusPipeline, idCurrency){
  const json = {
    "messageHeader": {
      "sessionToken": window.localStorage.getItem('sessionToken'),
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
      "startDate": null,
      "endDate": null,
      "idStatusPipeline": idStatusPipeline === undefined || idStatusPipeline === '' ? null : idStatusPipeline,
      "idCurrency": idCurrency === undefined || idCurrency === '' ? null : idCurrency
    }
  }

  var request = axios.post(APP_URL + "/portfolioPipeline", json);
  return{
    type: CONSULT_PIPELINE,
    payload: request
  }
}

/**
 * Action para llamar al servicio de cantidad de previsitas.
 */
export function consultInformationPrevisit() {
  const json = {
    "messageHeader": {
      "sessionToken": window.localStorage.getItem('sessionToken'),
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
      "startDate": null,
      "endDate": null
    }
  };
  let request = axios.post(APP_URL + "/portfolioPrevisit", json);
  return {
    type: CONSULT_PREVISIT,
    payload: request
  };
};

export function consultInformationVisit() {
  const json = {
    "messageHeader": {
      "sessionToken": window.localStorage.getItem('sessionToken'),
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
      "startDate": null,
      "endDate": null
    }
  };
  let request = axios.post(APP_URL + "/portfolioVisit", json);
  return {
    type: CONSULT_VISIT,
    payload: request
  };
};

export function getCsv(year,url, hasParticipatingContacts, hasParticipatingEmployees, hasRelatedEmployees) {
  const json = {
    "messageHeader": {
      "sessionToken": window.localStorage.getItem('sessionToken'),
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

export function consultCurrencys(){
  const json = {
    "messageHeader": {
      "sessionToken": window.localStorage.getItem('sessionToken'),
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
    "messageBody": ""
  }

  var request = axios.post(APP_URL + "/getCurrencyData", json);
  return{
    type: CONSULT_CURRENCY,
    payload: request
  }
}

export function consultInformationBusinessPlans(year) {
  const json = {
    "messageHeader": {
      "sessionToken": window.localStorage.getItem('sessionToken'),
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
      "year": year
    }
  };
  let request = axios.post(APP_URL + "/businessPlanManagement", json);
  return {
    type: CONSULT_BUSINESS_PLANS,
    payload: request
  };
}
