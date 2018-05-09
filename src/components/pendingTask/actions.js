import { APP_URL } from '../../constantsGlobal';
import {
    CLEAR_USER_TASK_CREATE, CLEAR_USER_TASK_ORDER, CLEAR_USER_TASK_CREAR, ORDER_COLUMN_TASK,
    GET_USER_TASK_LIST_CLIENT, CHANGE_KEYWORD_USERTASK, CHANGE_PAGE, LIMITE_INF, CLEAR_USER_TASK,
    CLEAR_USER_TASK_PAGINATOR
} from './constants';
import axios from 'axios';

export function tasksByClientFindServer(pageNum, clientId, maxRows, columnOrder, order, status) {
    const json = {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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
            "clientId": clientId,
            "pageNum": pageNum,
            "maxRows": maxRows,
            "columnOrder": columnOrder,
            "order": order,
            "status": status
        }
    };


    var request = axios.post(APP_URL + "/pendingTaskList", json);
    return {
        type: GET_USER_TASK_LIST_CLIENT,
        payload: request
    }
}

export function changePage(page) {
    return {
        type: CHANGE_PAGE,
        currentPage: page
    }
}

export function limitiInf(limInf) {
    return {
        type: LIMITE_INF,
        limInfe: limInf
    }
}


export function clearUserTask() {
    return {
        type: CLEAR_USER_TASK
    };
}

export function clearUserTaskPaginator() {
    return {
        type: CLEAR_USER_TASK_PAGINATOR
    };
}

export function clearUserTaskOrder() {
    return {
        type: CLEAR_USER_TASK_ORDER
    };
}

export function clearUserTaskCreate() {
    return {
        type: CLEAR_USER_TASK_CREATE
    };
}

export function orderColumnUserTask(orderTask, columnTask) {
    return {
        type: ORDER_COLUMN_TASK,
        orderTask: orderTask,
        columnTask: columnTask
    };
}
