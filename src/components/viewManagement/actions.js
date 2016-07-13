import {APP_URL} from '../../constantsGlobal';
import axios from 'axios';
import {TAB_SELETED_ACTIVE, CONSULT_PIPELINE} from './constants';

export function changeTabSeletedChartView(tabSeleted){
  return{
    type: TAB_SELETED_ACTIVE,
    tabSeleted: tabSeleted
  }
}

export function consultInformationPipeline(idStatusPipeline){
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
      "idStatusPipeline": idStatusPipeline === undefined || idStatusPipeline === '' ? null : idStatusPipeline
    }
  }

  var request = axios.post(APP_URL + "/portfolioPipeline", json);
  return{
    type: CONSULT_PIPELINE,
    payload: request
  }
}
