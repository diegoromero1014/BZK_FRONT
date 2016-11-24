/**
 * Created by ahurtado on 11/23/2016.
 */
import {APP_URL} from '../../constantsGlobal';
import {CLIENTS_FIND_FOR_ALERT_PENDING_UPDATE, CHANGE_PAGE_FOR_ALERT_PENDING_UPDATE, CHANGE_KEYWORD_NAME_NIT, CLEAR_FILTER} from './constants';
import axios from 'axios';

export function clientsFindServer(keyword, limInf, limSup,certificationStatus,teamId){
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
            "keyword": keyword,
            "limInf": limInf,
            "limSup": limSup,
            "certificationStatus": certificationStatus,
            "teamId" : teamId
        }
    };

    var request = axios.post(APP_URL + "/clientListForEmployee", json);
    return{
        type: CLIENTS_FIND_FOR_ALERT_PENDING_UPDATE,
        payload: request
    }
}

export function changePage(page){
    return{
        type: CHANGE_PAGE_FOR_ALERT_PENDING_UPDATE,
        currentPage: page
    }
}

export function changeKeyword(keyword){
    return{
        type: CHANGE_KEYWORD_NAME_NIT,
        keywordNameNit: keyword
    }
}

export function clearFilter(){
    return {
        type: CLEAR_FILTER
    }
}
