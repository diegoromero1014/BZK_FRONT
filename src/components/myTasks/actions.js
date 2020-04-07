import {APP_URL} from "../../constantsGlobal";
import axios from "axios";
import {
    CHANGE_PAG_FINISHED,
    CHANGE_PAG_PENDING,
    CLEAN_FINALIZED_TASKS,
    CLEAN_PAG_SET_ORDER_FINALIZED,
    CLEAN_PAG_SET_ORDER_PENDING,
    CLEAN_PENDING_TASKS,
    FINISHED,
    GET_ASSISTANTS_USER,
    GET_FINALIZED_TASKS,
    GET_PENDING_TASKS,
    PENDING,
    SET_FILTERS
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

export function cleanPageAndSetOrderPending (order, rowCount) {
   return{
       type: CLEAN_PAG_SET_ORDER_PENDING,
       orderTask: order,
       rowCount
    };
}

export function cleanPageAndSetOrderFinalized(order, rowCount) {
    return {
        type: CLEAN_PAG_SET_ORDER_FINALIZED,
        orderTask: order,
      rowCount
    };
}

export function setPagePending(page, order, rowCount) {
    return {
        type: CHANGE_PAG_PENDING,
        page,
      order,
      rowCount
    };
}

export function setPageFinalized(page, order, rowCount) {
    return {
        type: CHANGE_PAG_FINISHED,
        page,
      order,
      rowCount
    };
}
export function cleanPendingTasks() {
  return {
    type: CLEAN_PENDING_TASKS
  };
}
export function cleanFinalizedTasks() {
  return {
    type: CLEAN_FINALIZED_TASKS
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
        type: SET_FILTERS,
        rolFilter: rolFiltered
    };
}