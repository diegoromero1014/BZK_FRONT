import {APP_URL} from '../../constantsGlobal';
import axios from 'axios';
import {FILTER_MULTISELECT_FIELDS, CLEAR_VALUES_COUNTRY, ECONOMIC_GROUPS,
    TEAM_FOR_REGION_EMPLOYEE,CLEAR_VALUES_COUNTRY_KEY, PIPELINE_PRODUCTS,
    PIPELINE_CURRENCIES, PIPELINE_CLIENT_NEEDS } from './constants';
import {isUndefined, isNull} from 'lodash';

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
  const request = axios.post(APP_URL + "/masterDataByField", json);
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
  const request = axios.post(APP_URL + "/" + field, json);
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
    };
  const request = axios.post(APP_URL + "/" + field, json);
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
    };
  const request = axios.post(APP_URL + "/masterDataByParentId", json);
  return {
    type: field,
    payload: request
  }
}

/**
 * @param fields lista de nombres de las listas que se quieren consultar
 */
export function getMasterDataFields(fields, onlyWithoutParents) {
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
      "fields": fields,
      "onlyWithoutParents": isUndefined(onlyWithoutParents) || isNull(onlyWithoutParents) ? false : onlyWithoutParents
    }
  }

  const request = axios.post(APP_URL + "/masterDataByFields", json);

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
  const request = axios.post(APP_URL + "/economicGroupsByKeyword", json);
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


export function consultTeamsByRegionByEmployee(idRegion){
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
            "idRegion": idRegion
        }
    };
    const request = axios.post(APP_URL + "/getCellsByRegionByUser", json);
    return {
        type: TEAM_FOR_REGION_EMPLOYEE,
        payload: request
    }
}