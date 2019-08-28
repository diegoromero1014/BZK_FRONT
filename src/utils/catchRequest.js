import axios from "axios"

import { executeFunctionIf } from './browserValidation';
import * as constants from '../constantsGlobal';

export function makeRequest(url, json) {
    return axios.post(url, json);
}

export function catchAction(messageBody, endpoint, actionType, param) {

    let jsonBody = {
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
        "messageBody": ""
    }

    jsonBody.messageBody = messageBody;

    var result = getCatchedResult(endpoint, param);
    

    if (result) {
        return {
            type: actionType,
            payload: result
        }
    } else {
        result = makeRequest(constants.APP_URL + endpoint, jsonBody);
    }

    catchRequest(endpoint, param, result);

    return {
        type: actionType,
        payload: result
    }


}

export function executePromiseIf(condition, asyncFunction, doable, onError) {

    let executeCondition;
    let executeDoable;

    if (typeof condition === 'function' ) {
        executeCondition = condition;
    } else if (typeof condition === 'boolean') {
        executeCondition = () => condition
    } else {
        return;
    }

    if (typeof doable === 'function') {
        executeDoable = doable;
    } else {
        executeDoable = () => {};
    }

    executeFunctionIf(executeCondition, () => asyncFunction().then((...args) => executeDoable(...args)), onError);
}

let catchedEnpoints = []

export function clearCache() {
    catchedEnpoints = [];
}

export function getCatchedResult(endpoint, params) {
    let catchedEnpoint = catchedEnpoints.filter((element) => element.endpoint == endpoint);

    if (catchedEnpoint.length == 0) {
        return false;
    }

    let catchedResponse = catchedEnpoint[0].results.filter((element) => element.checkCondition(params));

    if (catchedResponse.length == 0) {
        return false;
    }

    return catchedResponse[0].result;

}

export function catchRequest(endpoint, params, result) {

    let results = catchedEnpoints.filter((element) => element.endpoint == endpoint);
    let newValue = false
    let catchedEnpoint;

    if (results.length == 0) {
        newValue = true;
        catchedEnpoint = {
            endpoint,
            results : []
        }
    } else {
        catchedEnpoint = results[0];
    }

    let catchedResponse = catchedEnpoint.results.filter((element) => element.checkCondition(params));

    if (catchedResponse.length == 0) {
        catchedEnpoint.results.push({
            checkCondition: (checkParams) => checkParams == params,
            result 
        })
    }

    if (newValue) {
        catchedEnpoints.push(catchedEnpoint);
    }

}