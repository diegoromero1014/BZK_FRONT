/**
 * Created by user- on 11/22/2016.
 */
import {APP_URL} from '../../constantsGlobal';
import {GET_ALERT_BY_USER} from './constants';
import axios from 'axios';


export function getAlertsByUser(limInf, limSup){
    const json = {
        "messageHeader":{
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
        "messageBody":{
            "limInf": limInf,
            "limSup": limSup
        }
    };

        var request = axios.post(APP_URL + "/clientListForEmployee", json);
    return{
        type: GET_ALERT_BY_USER,
        payload: request
    }
}