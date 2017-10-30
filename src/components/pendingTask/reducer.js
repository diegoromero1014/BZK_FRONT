import Immutable from 'immutable';
import { CLEAR_USER_TASK_CREATE, CLEAR_USER_TASK_ORDER, CLEAR_USER_TASK_CREAR, ORDER_COLUMN_TASK, GET_USER_TASK_LIST_CLIENT, CHANGE_KEYWORD_USERTASK, CHANGE_PAGE, LIMITE_INF, CLEAR_USER_TASK, CLEAR_USER_TASK_PAGINATOR } from './constants';

const initialState = Immutable.Map({
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
                    .set('status', response.status)
                    .set('rowCount', response.rowCount)
                    .set('userTasksByClient', JSON.parse(response.pendingTaskList))
                    .set('userName', null);
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
        case CLEAR_USER_TASK_PAGINATOR || CLEAR_USER_TASK_CREATE:
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
        default:
            return state;
    }
}
