import Immutable from 'immutable';
import {
  CHANGE_PAGE,
  CHANGE_PAGE_FINALIZED,
  CHANGE_PAGE_PENDING,
  CLEAN_PAG_ORDER_COLUMN_FINALIZED_TASK,
  CLEAN_PAG_ORDER_COLUMN_PENDING_TASK,
  CLEAN_TEXT_TO_SEARCH,
  CLEAR_USER_TASK,
  GET_FINALIZED_TASKS_CLIENT,
  GET_PENDING_TASKS_CLIENT,
  LIMITE_INF, SET_TASK_ID_FROM_REDIRECT,
  SET_TEXT_TO_SEARCH
} from "./constants";

const initialState = Immutable.Map({
  tabPending: {
    page: 0,
    order: 0,
    rowCount: 0,
    data: []
  },
  tabFinished: {
    page: 0,
    order: 0,
    rowCount: 0,
    data: []
  },
  status: "processed",
  keywordUserTask: "",
  userTasksByClient: [],
  page: 1,
  limInf: 0,
  orderTask: 0,
  columnTask: "finalDate",
  rowCount: 0,
  textToSearch: null,
  taskIdFromRedirect: null
});

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PENDING_TASKS_CLIENT:
      let resultPending = {
        page: action.page,
        order: action.order,
        rowCount: action.data.rowCount,
        data: action.data.rows
      };
      return state.withMutations(map => {
        map.set("tabPending", resultPending)
      });
    case GET_FINALIZED_TASKS_CLIENT:
      let resultFinalized = {
        page: action.page,
        order: action.order,
        rowCount: action.data.rowCount,
        data: action.data.rows
      };
      return state.withMutations(map => {
        map.set("tabFinished", resultFinalized)
      });
    case CHANGE_PAGE:
      return state.set('page', action.currentPage);
    case LIMITE_INF:
      return state.set('limInf', action.limInfe);

    case CHANGE_PAGE_PENDING:
      let changePagePending = {
        page: action.currentPage,
        order: action.orderTask,
        rowCount: 0,
        data: []
      };
      return state.withMutations(map => {
        map.set("tabPending", changePagePending)
      });
    case CHANGE_PAGE_FINALIZED:
      let changePageFinalized = {
        page: action.currentPage,
        order: action.orderTask,
        rowCount: 0,
        data: []
      };
      return state.withMutations(map => {
        map.set("tabFinished", changePageFinalized)
      });
    case CLEAR_USER_TASK:
      return state.withMutations(map => {
        map
        .set('page', 1)
        .set('limInf', 0)
        .set('rowCount', 0)
        .set('userTasksByClient', [])
        .set('orderTask', 0)
        .set('columnTask', "finalDate");
      });
    case CLEAN_PAG_ORDER_COLUMN_PENDING_TASK:
      let cleanPagAndOrderPending = {
        page: 1,
        order: action.orderTask,
        rowCount: 0,
        data: []
      };
      return state.withMutations(map => {
        map.set("tabPending", cleanPagAndOrderPending);
      });
    case CLEAN_PAG_ORDER_COLUMN_FINALIZED_TASK:
      let cleanPagAndOrderFinished = {
        page: 1,
        order: action.orderTask,
        rowCount: 0,
        data: []
      };
      return state.withMutations(map => {
        map.set("tabFinished", cleanPagAndOrderFinished);
      });
    case SET_TEXT_TO_SEARCH:
      return state.withMutations(map => {
        map.set("textToSearch", action.textToSearch);
      });
    case CLEAN_TEXT_TO_SEARCH:
      return state.withMutations(map => {
        map.set("textToSearch", null);
      });
    case SET_TASK_ID_FROM_REDIRECT:
      return state.withMutations(map => {
        map.set("taskIdFromRedirect", action.id);
      });
    default:
      return state;
  }
}
