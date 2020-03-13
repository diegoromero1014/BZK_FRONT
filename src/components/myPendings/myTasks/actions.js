import axios from 'axios';
import { downloadReport } from '../../../utils';

import { APP_URL } from '../../../constantsGlobal';
import {
  CHANGE_PAGE,
  CHANGE_PAGE_TEAM,
  CLEAR_LIST_MY_PENDINGS,
  CLEAR_LIST_MY_PENDINGS_TEAM,
  CLEAR_MY_PENDINGS_ORDER,
  CLEAR_MY_PENDINGS_PAGINATOR,
  CLEAR_MY_PENDINGS_PAGINATOR_TEAM,
  CLEAR_MY_PENDINGS_TEAM_ORDER,
  CLEAR_PENDING_TASK,
  CLEAR_PENDING_TASK_TEAM,
  FIND_PENDING_TASKS,
  FIND_PENDING_TASKS_TEAM,
  GET_DOWNLOAD_MY_PENDINGS_TASKS,
  GET_DOWNLOAD_PENDINGS_TASKS,
  GET_INFO_USERTASK,
  LIMITE_INF,
  LIMITE_INF_TEAM,
  ORDER_COLUMN_MY_PENDING,
  ORDER_COLUMN_MY_PENDING_TEAM,
  UPDATE_STATUS_TASK
} from './constants';

export function tasksByUser(pageNum, maxRows, keyWord, orderMyPending, columnMyPending) {
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
      "pageNum": pageNum,
      "maxRows": maxRows,
      "keyWord": keyWord,
      "order": orderMyPending,
      "columnOrder": columnMyPending
    }
  };


  const request = axios.post(APP_URL + "/pendingTaskListByUser", json);
  return {
    type: FIND_PENDING_TASKS,
    payload: request
  }
}

export function getInfoTaskUser(idTask) {
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
    "messageBody": idTask
  };


  const request = axios.post(APP_URL + "/getPendingTaskById", json);
  return {
    type: GET_INFO_USERTASK,
    payload: request
  }
}

export function updateStatusTask(idTask, idStatus) {
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
      idTask: idTask,
      idStatus: idStatus
    }
  };


  const request = axios.post(APP_URL + "/updateStatusTask", json);
  return {
    type: UPDATE_STATUS_TASK,
    payload: request
  }
}

export function limitiInf(limInf) {
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

export function clearPendingTask() {
  return {
    type: CLEAR_PENDING_TASK
  };
}

export function clearMyPendingsOrder() {
  return {
    type: CLEAR_MY_PENDINGS_ORDER
  };
}

export function clearMyPendingPaginator() {
  return {
    type: CLEAR_MY_PENDINGS_PAGINATOR
  };
}

export function orderColumnMyPending(orderMyPending, columnMyPending) {
  return {
    type: ORDER_COLUMN_MY_PENDING,
    orderMyPending: orderMyPending,
    columnMyPending: columnMyPending
  };
}

export function clearOnlyListPendingTask() {
  return {
    type: CLEAR_LIST_MY_PENDINGS
  };
}

export function getDownloadPendingTask(region, zone, team, taskStatus, dateTaskTeam, idUsuario) {
  const json = {
    "messageHeader": {
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
    },
    "messageBody": {
      "pageNum": '',
      "maxRows": '',
      'region': region,
      'zone': zone,
      'team': team,
      'taskStatus': taskStatus,
      'dateTaskTeam': dateTaskTeam,
      'idUsuario': idUsuario,
      "order": '',
      "columnOrder": ''
    }
  };

  let request = axios.post(APP_URL + "/downloadPendingsTasksTeam", json);
  return {
    type: GET_DOWNLOAD_PENDINGS_TASKS,
    payload: request
  }
}

export function getDownloadMyPendingTask(keyWord) {
  const json = {
    "messageHeader": {
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
    },
    "messageBody": {
      "pageNum": '',
      "maxRows": '',
      'region': '',
      'zone': '',
      'team': '',
      'taskStatus': '',
      'dateTaskTeam': '',
      'idUsuario': '',
      "order": '',
      "columnOrder": '',
      "keyWord": keyWord
    }
  };

  let request = axios.post(APP_URL + "/downloadMyPendingsTasks", json);
  return {
    type: GET_DOWNLOAD_MY_PENDINGS_TASKS,
    payload: request
  }
}

export function tasksTeamByUser(pageNum, maxRows, region, zone, team, taskStatus, dateTaskTeam, idUsuario, orderMyPending, columnMyPending) {
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
      "pageNum": pageNum,
      "maxRows": maxRows,
      'region': region,
      'zone': zone,
      'team': team,
      'taskStatus': taskStatus,
      'dateTaskTeam': dateTaskTeam,
      'idUsuario': idUsuario,
      "order": orderMyPending,
      "columnOrder": columnMyPending
    }
  };


  const request = axios.post(APP_URL + "/getPendingTaskTeamByUser", json);
  return {
    type: FIND_PENDING_TASKS_TEAM,
    payload: request
  }
}

export function changePageTeam(page) {
  return {
    type: CHANGE_PAGE_TEAM,
    currentPage: page
  }
}


export function limitiInfTeam(limInf) {
  return {
    type: LIMITE_INF_TEAM,
    limInfe: limInf
  }
}

export function clearMyPendingTeamPaginator() {
  return {
    type: CLEAR_MY_PENDINGS_PAGINATOR_TEAM
  };
}

export function clearOnlyListPendingTaskTeam() {
  return {
    type: CLEAR_LIST_MY_PENDINGS_TEAM
  };
}


export function orderColumnMyPendingTeam(orderMyPending, columnMyPending) {
  return {
    type: ORDER_COLUMN_MY_PENDING_TEAM,
    orderMyPending: orderMyPending,
    columnMyPending: columnMyPending
  };
}

export function clearPendingTaskTeam() {
  return {
    type: CLEAR_PENDING_TASK_TEAM
  };
}


export function clearMyPendingsTeamOrder() {
  return {
    type: CLEAR_MY_PENDINGS_TEAM_ORDER
  };
}

export function downloadPendingTask(listTask, changeStateSaveData) {
  const name = "TareasPendientes.xlsx";

  const payload = {
    "messageHeader": {
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
    },
    "messageBody": {
      "name": name,
      "route": "BiztrackReports/pendingTask.jrxml",
      "params": {},
      "source": listTask
    }
  };

  downloadReport(payload, "/generate/XLSX", name, changeStateSaveData);
}
