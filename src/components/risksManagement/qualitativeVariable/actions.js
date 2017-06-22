import { APP_URL } from '../../../constantsGlobal';
import { GET_SURVEY_QUALITATIVE, SAVE_ANSWER, FIELDS_EDITABLES, SAVE_RESPONSE_SURVEY, CLEAR_SURVEY, CAHNGE_VALUE_MODAL } from './constants';
import axios from 'axios';


export function getSurveyQualitativeVarible() {
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
        "messageBody": window.localStorage.getItem('idClientSelected')
    }
    var request = axios.post(APP_URL + "/getSurveyQualitativeVariable", json);
    return {
        type: GET_SURVEY_QUALITATIVE,
        payload: request
    }
}

export function clearSurvey(){
    return {
        type: CLEAR_SURVEY
    }
}

export function changeFieldsEditables(value){
    return {
        type: FIELDS_EDITABLES,
        value
    }
}

export function saveAnswerQuestion( listQuestions, nameList ){
    return {
        type: SAVE_ANSWER,
        listQuestions,
        nameList
    }
}

export function changeValueModalIsOpen( value ){
    return {
        type: CAHNGE_VALUE_MODAL,
        value
    }
}



export function saveResponseQualitativeSurvey(jsonSave) {
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
        "messageBody": jsonSave
    }
    var request = axios.post(APP_URL + "/saveResponseQualitativeSurvey", json);
    return {
        type: SAVE_RESPONSE_SURVEY,
        payload: request
    }
}
