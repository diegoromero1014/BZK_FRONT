/**
 * Created by user- on 11/22/2016.
 */
import {APP_URL} from '../../constantsGlobal';
import {GET_ALERT_BY_USER,OPEN_MODAL_ALERTS,CLEAR_MODAL_ALERTS} from './constants';
import axios from 'axios';


export function getAlertsByUser(){

    const json = {
        "messageHeader":{
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
        }
    };
        const request = axios.post(APP_URL + "/getAllNumberByAlertByUser", json);
    return{
        type: GET_ALERT_BY_USER,
        payload: request
    }
}

export function openModalAlerts(open){
    return{
        type: OPEN_MODAL_ALERTS,
        open
    }
}

export function clearListAlerts(){
    return{
        type: CLEAR_MODAL_ALERTS,
        open
    }
}