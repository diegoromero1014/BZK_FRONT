import {APP_URL} from '../../constantsGlobal';
import axios from 'axios';
import {TAB_SELETED_ACTIVE, GET_CSV_PIPELINE,CONSULT_PIPELINE, CONSULT_CURRENCY} from './constants';

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

export function getCsvPipeline(year) {
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
  }
  let request = axios.post(APP_URL + "/getCsvPipeline", json);
  return {
    type: GET_CSV_PIPELINE,
    payload: request
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
