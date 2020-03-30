import { APP_URL } from "../../constantsGlobal";
import axios from "axios";  
import {
  GET_PENDING_TASKS,
  GET_FINALIZED_TASKS,
  CLEAN_PAG_SET_ORDER_PENDING,
  CLEAN_PAG_SET_ORDER_FINALIZED,
  CHANGE_PAG_PENDING,
  CHANGE_PAG_FINISHED,
  PENDING,
  FINISHED,
  CLEAN_PENDING_TASKS,
  CLEAN_FINALIZED_TASKS
} from "./constants";

export function getPendingTaskPromise (pageNum, order, maxRows, textToSearch, modeQuery, users){
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
        mode: modeQuery,
        filter: {
          order,
          textToSearch,
          users
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

export function getFinalizedTaskPromise (pageNum, order, maxRows, textToSearch, modeQuery, users){
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
        mode: modeQuery,
        filter: {
          order,
          textToSearch,
          users
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
export function cleanPageAndSetOrderFinalized (order, rowCount) {
    return {
      type: CLEAN_PAG_SET_ORDER_FINALIZED,
      orderTask: order,
      rowCount
    };
}
export function setPagePending (page, order, rowCount) {
    return {
      type: CHANGE_PAG_PENDING,
      page,
      order,
      rowCount
    };
}
export function setPageFinalized (page, order, rowCount) {
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