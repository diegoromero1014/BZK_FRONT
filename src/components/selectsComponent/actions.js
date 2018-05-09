import { APP_URL } from '../../constantsGlobal';
import axios from 'axios';
import {
  FILTER_MULTISELECT_FIELDS, CLEAR_VALUES_COUNTRY, ECONOMIC_GROUPS,
  TEAM_FOR_REGION_EMPLOYEE, CLEAR_VALUES_COUNTRY_KEY, PIPELINE_PRODUCTS,
  PIPELINE_CURRENCIES, PIPELINE_CLIENT_NEEDS, CLEAR_LISTS, LIST_REGIONS_BY_EMPLOYEE
} from './constants';
import { isUndefined, isNull } from 'lodash';

export function consultDataSelect(field, mask) {
  const json = {
    messageHeader: {
      "timestamp": new Date().getTime(),
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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
    type: mask ? mask : field,
    payload: request
  }
}

export function consultList(field) {
  const json = {
    messageHeader: {
      "timestamp": new Date().getTime(),
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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
  };
  const request = axios.post(APP_URL + "/" + field, json);
  return {
    type: field,
    payload: request
  }
}

export function consultListWithParameter(field, parameter) {
  const json = {
    messageHeader: {
      "timestamp": new Date().getTime(),
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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

  if (typeof parameter === "object") {
    json.messageBody = parameter;
  } else {
    json.messageBody = { "parentId": parameter };
  }

  const request = axios.post(APP_URL + "/" + field, json);
  return {
    type: field,
    payload: request
  }
}

export function clrearConsultListWithParameter(field) {
  return {
    type: field
  }
}

export function consultListWithParameterUbication(field, parentId) {
  const json = {
    messageHeader: {
      "timestamp": new Date().getTime(),
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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

export function clearConsultListWithParameterUbication(field) {
  return {
    type: field
  }
}

/**
 * @param fields lista de nombres de las listas que se quieren consultar
 */
export function getMasterDataFields(fields, onlyWithoutParents) {
  const json = {
    messageHeader: {
      "timestamp": new Date().getTime(),
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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
  };

  const request = axios.post(APP_URL + "/masterDataByFields", json);

  return {
    type: FILTER_MULTISELECT_FIELDS,
    payload: request
  }
}

export function clearValuesAdressess() {
  return {
    type: CLEAR_VALUES_COUNTRY
  }
}

export function clearValuesAdressessKeys() {
  return {
    type: CLEAR_VALUES_COUNTRY_KEY
  }
}

export function economicGroupsByKeyword(keyword) {
  const json = {
    messageHeader: {
      "timestamp": new Date().getTime(),
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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
  };
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
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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

export function consultTeamsByRegionByEmployee(idRegion) {
  const json = {
    messageHeader: {
      "timestamp": new Date().getTime(),
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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

export function clearLists(lists) {
  return {
    type: CLEAR_LISTS,
    lists
  }
}

export function getRegionsByEmployee() {

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

    }
  }

  let request = axios.post(APP_URL + '/regionsByEmployee', json);
  return {
    type: LIST_REGIONS_BY_EMPLOYEE,
    payload: request
  };

}