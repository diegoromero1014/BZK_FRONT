import Immutable from 'immutable';
import {
  GET_PENDING_TASKS,
  GET_FINALIZED_TASKS,
  CLEAN_PAG_SET_ORDER_PENDING,
  CLEAN_PAG_SET_ORDER_FINALIZED,
  CHANGE_PAG_PENDING,
  CHANGE_PAG_FINISHED
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
  textToSearch: null
});

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PENDING_TASKS:
      let statePending = {
        page: action.page,
        order: action.order,
        rowCount: action.data.rowCount,
        data: action.data
      };
      return state.withMutations(map => {
        map.set("tabPending", statePending);
      });
    case GET_FINALIZED_TASKS:
    case GET_PENDING_TASKS:
      let stateFinalized = {
        page: action.page,
        order: action.order,
        rowCount: action.data.rowCount,
        data: action.data
      };
      return state.withMutations(map => {
        map.set("tabFinished", stateFinalized);
      });
    case CLEAN_PAG_SET_ORDER_PENDING:
      let stateCleanPending = {
        page: 0,
        order: action.order,
        rowCount: 0,
        data: []
      };
      return state.withMutations(map => {
        map.set("tabPending", stateCleanPending);
      });
    case CLEAN_PAG_SET_ORDER_FINALIZED:
      let stateCleaFinalized = {
        page: 0,
        order: action.order,
        rowCount: 0,
        data: []
      };
      return state.withMutations(map => {
        map.set("tabFinished", stateCleaFinalized);
      });
    case CHANGE_PAG_PENDING:
      let changePagePending = {
        page: action.currentPage,
        order: action.orderTask,
        rowCount: 0,
        data: []
      };
      return state.withMutations(map => {
        map.set("tabPending", changePagePending);
      });
    case CHANGE_PAG_FINISHED:
      let changePageFinalized = {
        page: action.currentPage,
        order: action.orderTask,
        rowCount: 0,
        data: []
      };
      return state.withMutations(map => {
        map.set("tabFinished", changePageFinalized);
      });
      default:
          return state;
  }
};
