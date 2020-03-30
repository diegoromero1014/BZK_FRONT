import {APP_URL} from "../../constantsGlobal";
import axios from "axios";
import {
    CHANGE_PAG_FINISHED,
    CHANGE_PAG_PENDING,
    CLEAN_PAG_SET_ORDER_FINALIZED,
    CLEAN_PAG_SET_ORDER_PENDING,
    FINISHED,
    GET_ASSISTANTS_USER,
    GET_FINALIZED_TASKS,
    GET_PENDING_TASKS,
    PENDING,
    SET_ROL
} from "./constants";


export function getPendingTaskPromise(pageNum, order, maxRows, textToSearch, filters) {
    const json = {
        messageHeader: {
            sessionToken: window.localStorage.getItem("sessionTokenFront"),
            username: "",
            timestamp: new Date().getTime(),
            service: "",
            status: "0",
            language: "es",
            displayErrorMessage: "",
            technicalErrorMessage: "",
            applicationVersion: "",
            debug: true,
            isSuccessful: true
        },
        messageBody: {
            pageNum,
            maxRows,
            section: PENDING,
            mode: filters.rol,
            filter: {
                users: filters.users,
                order,
                textToSearch,
                createDateFrom: filters.initialDate,
                createDateTo: filters.finalDate
            }
        }
    };
    return axios.post(APP_URL + "/getTask", json);
}

export function pendingTasks(data, page, order) {
    return {
        type: GET_PENDING_TASKS,
        data,
        page,
        order
    };
}

export function getFinalizedTaskPromise(pageNum, order, maxRows, textToSearch, filters) {
    const json = {
        messageHeader: {
            sessionToken: window.localStorage.getItem("sessionTokenFront"),
            username: "",
            timestamp: new Date().getTime(),
            service: "",
            status: "0",
            language: "es",
            displayErrorMessage: "",
            technicalErrorMessage: "",
            applicationVersion: "",
            debug: true,
            isSuccessful: true
        },
        messageBody: {
            pageNum,
            maxRows,
            section: FINISHED,
            mode: filters.rol,
            filter: {
                users: filters.users,
                order,
                textToSearch,
                createDateFrom: filters.initialDate,
                createDateTo: filters.finalDate
            }
        }
    };
    return axios.post(APP_URL + "/getTask", json);
}

export function finalizedTasks(data, page, order) {
    return {
        type: GET_FINALIZED_TASKS,
        data,
        page,
        order
    };
}

export function cleanPageAndSetOrderPending(order) {
    return {
        type: CLEAN_PAG_SET_ORDER_PENDING,
        order
    };
}

export function cleanPageAndSetOrderFinalized(order) {
    return {
        type: CLEAN_PAG_SET_ORDER_FINALIZED,
        order
    };
}

export function setPagePending(page) {
    return {
        type: CHANGE_PAG_PENDING,
        page
    };
}

export function setPageFinalized(page) {
    return {
        type: CHANGE_PAG_FINISHED,
        page
    };
}

export function getUserAssistantsById() {
    const json = {
        messageHeader: {
            "sessionToken": window.localStorage.getItem('sessionTokenFront')
        },
        messageBody: null
    };

    return {
        type: GET_ASSISTANTS_USER,
        payload: axios.post(APP_URL + "/getUserAssistantsById", json)
    }
}

export function setRolToSearch(rolFiltered) {
    return {
        type: SET_ROL,
        rolFilter: rolFiltered
    };
}