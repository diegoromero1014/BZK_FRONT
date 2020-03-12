import Immutable from 'immutable';
import {
  CHANGE_PAGE,
  CLEAR_USER_TASK,
  CLEAR_USER_TASK_ORDER,
  CLEAR_USER_TASK_PAGINATOR,
  GET_USER_TASK_LIST_CLIENT,
  LIMITE_INF,
  LOAD_PENDING,
  ORDER_COLUMN_TASK
} from './constants';

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
  rowCount: 0
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
    case CHANGE_PAGE:
      return state.set('page', action.currentPage);
    case LIMITE_INF:
      return state.set('limInf', action.limInfe);
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
    default:
      return state;
  }
}
