import axios from 'axios';
import { APP_URL } from '../../../constantsGlobal';
import {
    GET_ASSIGNED, CLEAR_LIST_OF_ASSIGNED, CHANGE_PAGE, LIMITE_INF, CHANGE_SORT_ORDER,
    CHANGE_CLIENT_NUMBER_OR_NAME, CHANGE_HOMEWORK_TIME, CHANGE_STATE
} from './constants';

export function getAssigned(pagination) {
    const json = {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionToken'),
            "username": "",
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
            "statusOfTask": pagination.statusOfTask,
            "clientNumber": pagination.clientNumber,
            "clientName": pagination.clientName,
            "sortOrder": pagination.sortOrder,
            "pageNum": pagination.pageNum,
            "maxRows": pagination.maxRows
        }
    };


    var request = axios.post(APP_URL + "/getAssignedByUser", json);
    return {
        type: GET_ASSIGNED,
        payload: request
    }
}


export function limitInf(limInf) {
    return {
        type: LIMITE_INF,
        limInfe: limInf
    }
}

export function changePage(page) {
    return {
        type: CHANGE_PAGE,
        currentPage: page
    }
}

export function changeSortOrder(sortOder) {
    return {
        type: CHANGE_SORT_ORDER,
        sortOder: sortOder
    }
}

export function changeClientNumberOrName(clientNumberOrName) {
    return {
        type: CHANGE_CLIENT_NUMBER_OR_NAME,
        clientNumberOrName: clientNumberOrName
    }
}

export function changeState(state) {
    return {
        type: CHANGE_STATE,
        state: state
    }
}

export function changeHomeworkTime(homeworkTime) {
    return {
        type: CHANGE_HOMEWORK_TIME,
        homeworkTime: homeworkTime
    }
}

export function clearListOfAssigned() {
    return {
        type: CLEAR_LIST_OF_ASSIGNED
    };
}