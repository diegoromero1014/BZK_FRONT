import { APP_URL } from '../../../constantsGlobal';
import { GET_SURVEY_QUALITATIVE, SAVE_ANSWER } from './constants';
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
        "messageBody": ""
    }
    var request = axios.post(APP_URL + "/getSurveyQualitativeVariable", json);
    return {
        type: GET_SURVEY_QUALITATIVE,
        payload: request
    }
}

export function saveAnswerQuestion( listQuestions ){
    return {
        type: SAVE_ANSWER,
        listQuestions
    }

}