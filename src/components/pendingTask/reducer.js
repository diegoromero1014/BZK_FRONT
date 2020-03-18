import Immutable from 'immutable';
import {
  CHANGE_PAGE,
  CLEAR_USER_TASK,
  CLEAR_USER_TASK_ORDER,
  CLEAR_USER_TASK_PAGINATOR,
  GET_USER_TASK_LIST_CLIENT,
  LIMITE_INF,
  LOAD_PENDING,
  ORDER_COLUMN_TASK,
  GET_FINALIZED_TASKS_CLIENT,
  GET_PENDING_TASKS_CLIENT,
  CLEAN_PAG_ORDER_COLUMN_PENDING_TASK,
  CLEAN_PAG_ORDER_COLUMN_FINALIZED_TASK,
  CHANGE_PAGE_PENDING,
  CHANGE_PAGE_FINALIZED,
  SET_TEXT_TO_SEARCH,
  CLEAN_TEXT_TO_SEARCH
} from "./constants";

const initialState = Immutable.Map({
  tabPending: {
    page: 0,
    order: 0,
    rowCount: 0,
    data: {}
  },
  tabFinished: {
    page: 0,
    order: 0,
    rowCount: 0,
    data: {}
  },
  status: "processed",
  keywordUserTask: "",
  userTasksByClient: [],
  page: 1,
  limInf: 0,
  orderTask: 0,
  columnTask: "finalDate",
  rowCount: 0,
  textToSearch:null
});

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_TASK_LIST_CLIENT:
      const response = action.payload.data;
      return state.withMutations(map => {
        map
        .set('status', response.data.status)
        .set('rowCount', response.data.rowCount)
        .set('userTasksByClient', response.data.rows)
      });
    case GET_PENDING_TASKS_CLIENT:
      let resultPending = {
        page: action.page,
        order: action.order,
        rowCount: action.data.rowCount,
        data: action.data.rows
      };
      return state.withMutations(map => { map.set("tabPending", resultPending)});
    case GET_FINALIZED_TASKS_CLIENT:
      let resultFinalized = {
        page: action.page,
        order: action.order,
        rowCount: action.data.rowCount,
        data: action.data.rows
      };
      return state.withMutations(map => { map.set("tabFinished", resultFinalized)});
    case CHANGE_PAGE:
      return state.set('page', action.currentPage);
    case LIMITE_INF:
      return state.set('limInf', action.limInfe);

    case CHANGE_PAGE_PENDING:
        let changePagePending = {
          page: action.currentPage,
          order: action.orderTask,
          rowCount: 0,
          data: {}
        };
        return state.withMutations(map => { map.set("tabPending", changePagePending)});
    case CHANGE_PAGE_FINALIZED:
        let changePageFinalized = {
          page: action.currentPage,
          order: action.orderTask,
          rowCount: 0,
          data: {}
        };
        return state.withMutations(map => { map.set("tabFinished", changePageFinalized)});
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
    case CLEAR_USER_TASK_PAGINATOR:
      return state.withMutations(map => {
        map
        .set('page', 1)
        .set('limInf', 0)
      });
    case CLEAR_USER_TASK_ORDER:
      return state.withMutations(map => {
        map
        .set('orderTask', 0)
        .set('columnTask', "finalDate")
      });
    case ORDER_COLUMN_TASK:
      return state.withMutations(map => {
        map
        .set('orderTask', action.orderTask)
        .set('columnTask', action.columnTask)
      });
    case CLEAN_PAG_ORDER_COLUMN_PENDING_TASK:
        let cleanPagAndOrderPending = {
          page: 1,
          order: action.orderTask,
          rowCount: 0,
          data: {}
        };
      return state.withMutations(map => {
        map.set("tabPending", cleanPagAndOrderPending);
      });
    case CLEAN_PAG_ORDER_COLUMN_FINALIZED_TASK:
      let cleanPagAndOrderFinished = {
        page: 1,
        order: action.orderTask,
        rowCount: 0,
        data: {}
      };
      return state.withMutations(map => {
        map.set("tabFinished", cleanPagAndOrderFinished);
      });
    case LOAD_PENDING:
      const result = {
        page: 0,
        order: 0,
        rowCount: action.data.rowCount,
        data: action.data.rows
      };

      return state.withMutations(map => {
        map
        .set('tabPending', result)
      });
      case SET_TEXT_TO_SEARCH:
        return state.withMutations(map => {
            map.set("textToSearch", action.textToSearch);
        });
      case CLEAN_TEXT_TO_SEARCH:
        return state.withMutations(map => {
          map.set("textToSearch", null);
        });
    default:
      return state;
  }
}
