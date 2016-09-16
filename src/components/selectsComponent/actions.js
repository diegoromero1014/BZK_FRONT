import {APP_URL} from '../../constantsGlobal';
import axios from 'axios';
import {FILTER_MULTISELECT_FIELDS, CLEAR_VALUES_COUNTRY, ECONOMIC_GROUPS, CLEAR_VALUES_COUNTRY_KEY, PIPELINE_PRODUCTS, PIPELINE_CURRENCIES, PIPELINE_CLIENT_NEEDS } from './constants';

export function consultDataSelect(field){
  const json = {
      messageHeader: {
        "timestamp": new Date().getTime(),
        "sessionToken": window.localStorage.getItem('sessionToken'),
        "service": "",
        "status": "0",
        "language": "es",
        "displayErrorMessage": "",
        "technicalErrorMessage": "",
        "applicationVersion": "",
        "debug": true,
        "isSuccessful": true
      },
      messageBody: {
        "field": field
      }
    };
  var request = axios.post(APP_URL + "/masterDataByField", json);
  return {
    type: field,
    payload: request
  }
}

export function consultList(field){
  const json = {
      messageHeader: {
        "timestamp": new Date().getTime(),
        "sessionToken": window.localStorage.getItem('sessionToken'),
        "service": "",
        "status": "0",
        "language": "es",
        "displayErrorMessage": "",
        "technicalErrorMessage": "",
        "applicationVersion": "",
        "debug": true,
        "isSuccessful": true
      },
      messageBody: {
      }
    }
  var request = axios.post(APP_URL + "/" + field, json);
  return {
    type: field,
    payload: request
  }
}

export function consultListWithParameter(field, parentId){
  const json = {
      messageHeader: {
        "timestamp": new Date().getTime(),
        "sessionToken": window.localStorage.getItem('sessionToken'),
        "service": "",
        "status": "0",
        "language": "es",
        "displayErrorMessage": "",
        "technicalErrorMessage": "",
        "applicationVersion": "",
        "debug": true,
        "isSuccessful": true
      },
      messageBody: {
        "parentId": parentId
      }
    }
  var request = axios.post(APP_URL + "/" + field, json);
  return {
    type: field,
    payload: request
  }
}

export function consultListWithParameterUbication(field, parentId){
  const json = {
      messageHeader: {
        "timestamp": new Date().getTime(),
        "sessionToken": window.localStorage.getItem('sessionToken'),
        "service": "",
        "status": "0",
        "language": "es",
        "displayErrorMessage": "",
        "technicalErrorMessage": "",
        "applicationVersion": "",
        "debug": true,
        "isSuccessful": true
      },
      messageBody: {
        "parentId": parentId
      }
    }
  var request = axios.post(APP_URL + "/masterDataByParentId", json);
  return {
    type: field,
    payload: request
  }
}

/**
 * @param fields lista de nombres de las listas que se quieren consultar
 */
export function getMasterDataFields(fields) {
  const json = {
    messageHeader: {
      "timestamp": new Date().getTime(),
      "sessionToken": window.localStorage.getItem('sessionToken'),
      "service": "",
      "status": "0",
      "language": "es",
      "displayErrorMessage": "",
      "technicalErrorMessage": "",
      "applicationVersion": "",
      "debug": true,
      "isSuccessful": true
    },
    messageBody: {
      "fields": fields
    }
  }

  var request = axios.post(APP_URL + "/masterDataByFields", json);

  return {
    type: FILTER_MULTISELECT_FIELDS,
    payload: request
  }
}

export function clearValuesAdressess(){
  return {
    type: CLEAR_VALUES_COUNTRY
  }
}

export function clearValuesAdressessKeys(){
  return {
    type: CLEAR_VALUES_COUNTRY_KEY
  }
}

export function economicGroupsByKeyword(keyword){
  const json = {
    messageHeader: {
      "timestamp": new Date().getTime(),
      "sessionToken": window.localStorage.getItem('sessionToken'),
      "service": "",
      "status": "0",
      "language": "es",
      "displayErrorMessage": "",
      "technicalErrorMessage": "",
      "applicationVersion": "",
      "debug": true,
      "isSuccessful": true
    },
    messageBody: {
      "keyword": keyword
    }
  }
  var request = axios.post(APP_URL + "/economicGroupsByKeyword", json);
  return {
    type: ECONOMIC_GROUPS,
    payload: request
  }
}

export function getPipelineProducts() {
  const json = {
    messageHeader: {
      "timestamp": new Date().getTime(),
      "sessionToken": window.localStorage.getItem('sessionToken'),
      "service": "",
      "status": "0",
      "language": "es",
      "displayErrorMessage": "",
      "technicalErrorMessage": "",
      "applicationVersion": "",
      "debug": true,
      "isSuccessful": true
    },
    messageBody: {}
  };
  let request = axios.post(APP_URL + "/productList", json);
  return {
    type: PIPELINE_PRODUCTS,
    payload: request
  };
}

export function getPipelineCurrencies() {
  const json = {
    messageHeader: {
      "timestamp": new Date().getTime(),
      "sessionToken": window.localStorage.getItem('sessionToken'),
      "service": "",
      "status": "0",
      "language": "es",
      "displayErrorMessage": "",
      "technicalErrorMessage": "",
      "applicationVersion": "",
      "debug": true,
      "isSuccessful": true
    },
    messageBody: {}
  };
  let request = axios.post(APP_URL + "/currencyList", json);
  return {
    type: PIPELINE_CURRENCIES,
    payload: request
  };
}

export function getClientNeeds() {
  const json = {
    messageHeader: {
      "timestamp": new Date().getTime(),
      "sessionToken": window.localStorage.getItem('sessionToken'),
      "service": "",
      "status": "0",
      "language": "es",
      "displayErrorMessage": "",
      "technicalErrorMessage": "",
      "applicationVersion": "",
      "debug": true,
      "isSuccessful": true
    },
    messageBody: {}
  };
  let request = axios.post(APP_URL + "/clientNeedList", json);
  return {
    type: PIPELINE_CLIENT_NEEDS,
    payload: request
  };
}
