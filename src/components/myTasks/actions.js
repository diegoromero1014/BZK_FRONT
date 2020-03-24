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
  FINISHED
} from "./constants";

export function getPendingTaskPromise (pageNum, order, maxRows, textToSearch){
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
        mode: "CLIENT",
        filter: {
          clientId: 5261530,
          order,
          textToSearch
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

export function getFinalizedTaskPromise (pageNum, order, maxRows, textToSearch){
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
        mode: "CLIENT",
        filter: {
          clientId: 5261530,
          order,
          textToSearch
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

export function cleanPageAndSetOrderPending (order) {
   return{ 
       type: CLEAN_PAG_SET_ORDER_PENDING,
       order
    };
}
export function cleanPageAndSetOrderFinalized (order) {
    return {
      type: CLEAN_PAG_SET_ORDER_FINALIZED,
      order
    };
}
export function setPagePending (page) {
    return {
      type: CHANGE_PAG_PENDING,
      page
    };
}
export function setPageFinalized (page) {
    return {
      type: CHANGE_PAG_FINISHED,
      page
    };
}