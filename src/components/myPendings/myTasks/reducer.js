import Immutable from 'immutable';
import * as constants from './constants';
import _ from 'lodash';

const initialState = Immutable.Map({
    status: "processed",
    pendingTaskListByUser: [],
    page: 1,
    task: null,
    limInf: 0,
    rowCount: 0,
    orderMyPending: 0,
    columnMyPending: ""
});

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case constants.FIND_PENDING_TASKS:
          const response = action.payload.data;
          return state.withMutations(map => {
              map
                  .set('status', response.status)
                  .set('rowCount', _.get(response, 'data.rowCount', 0))
                  .set('pendingTaskListByUser', _.get(response, 'data.rows', []));
          });
        case constants.CHANGE_PAGE:
            return state.set('page', action.currentPage);
        case constants.LIMITE_INF:
            return state.set('limInf', action.limInfe);
        case constants.GET_INFO_USERTASK:
            var responseTask = action.payload.data;
            return state.set('task', responseTask);
        case constants.CLEAR_MY_PENDINGS_ORDER:
            return state.withMutations(map => {
                  map
                  .set('orderMyPending', 0)
                  .set('columnMyPending', "")
              });
        case constants.CLEAR_MY_PENDINGS_PAGINATOR:
                return state.withMutations(map => {
                    map
                    .set('page', 1)
                    .set('limInf', 0);
                });
        case constants.CLEAR_PENDING_TASK:
            return state.withMutations(map => {
                map
                .set('page', 1)
                .set('limInf', 0)
                .set('rowCount', 0)
                .set('pendingTaskListByUser', []);
            });
        case constants.UPDATE_STATUS_TASK:
            return state.withMutations(map => {
                map
                .set('page', 1)
                .set('limInf', 0)
                .set('rowCount', 0)
                .set('pendingTaskListByUser', []);
            });
        case constants.ORDER_COLUMN_MY_PENDING:
              return state.withMutations(map => {
                  map
                  .set('orderMyPending', action.orderMyPending)
                  .set('columnMyPending', action.columnMyPending)});
        case constants.CLEAR_LIST_MY_PENDINGS:
            return state.set('pendingTaskListByUser', []);
        default:
            return state;
    }
}
