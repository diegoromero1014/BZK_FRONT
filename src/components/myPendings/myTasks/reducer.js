import Immutable from 'immutable';
import * as constants from './constants';
import _ from 'lodash';
import {CLEAR_TASK} from "../../pendingTask/constants";

const initialState = Immutable.Map({
    status: "processed",
    pendingTaskListByUser: [],
    page: 1,
    task: null,
    limInf: 0,
    rowCount: 0,
    orderMyPending: 0,
    columnMyPending: "",
    userName: null
});

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case constants.FIND_PENDING_TASKS:
            let response_tasks = action.payload.data;
            return state.withMutations(map => {
                map
                    .set('status', response_tasks.status)
                    .set('rowCount', _.get(response_tasks, 'data.rowCount', 0))
                    .set('pendingTaskListByUser', _.get(response_tasks, 'data.rows', []));
            });
        case constants.CHANGE_PAGE:
            return state.set('page', action.currentPage);
        case constants.LIMITE_INF:
            return state.set('limInf', action.limInfe);
        case constants.GET_INFO_USERTASK:
            var responseTask = action.payload.data;
            return state.withMutations(map => {
                map
                    .set('task', responseTask)
                    .set('userName', _.get(responseTask, 'data.userName'));

            });
        case CLEAR_TASK:
            return state.set('task', null);
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
                    .set('columnMyPending', action.columnMyPending)
            });
        case constants.CLEAR_LIST_MY_PENDINGS:
            return state.set('pendingTaskListByUser', []);
        case constants.UPDATE_USERNAME_TASK:
            return state.set('userName', action.username);





        case constants.FIND_PENDING_TASKS_TEAM:
            let response_task_team = action.payload.data;
            return state.withMutations(map => {
                map
                    .set('statusTeamTask', response_task_team.status)
                    .set('rowCountTeamTask', _.get(response_task_team, 'data.rowCount', 0))
                    .set('pendingTaskTeamListByUser', _.get(response_task_team, 'data.rows', []));
            });
        case constants.CHANGE_PAGE_TEAM:
            return state.set('pageTeam', action.currentPage);
        case constants.LIMITE_INF_TEAM:
            return state.set('limInfTeam', action.limInfe);
        case constants.CLEAR_MY_PENDINGS_PAGINATOR_TEAM:
            return state.withMutations(map => {
                map
                    .set('pageTeam', 1)
                    .set('limInfTeam', 0);
            });
        case constants.CLEAR_LIST_MY_PENDINGS_TEAM:
            return state.set('pendingTaskTeamListByUser', []);
        case constants.ORDER_COLUMN_MY_PENDING_TEAM:
            return state.withMutations(map => {
                map
                    .set('orderMyPendingTeam', action.orderMyPending)
                    .set('columnMyPendingTeam', action.columnMyPending)
            });
        case constants.CLEAR_PENDING_TASK_TEAM:
            return state.withMutations(map => {
                map
                    .set('pageTeam', 1)
                    .set('limInfTeam', 0)
                    .set('rowCountTeamTask', 0)
                    .set('pendingTaskTeamListByUser', []);
            });
        case constants.CLEAR_MY_PENDINGS_TEAM_ORDER:
            return state.withMutations(map => {
                map
                    .set('orderMyPendingTeam', 0)
                    .set('columnMyPendingTeam', "")
            });

        default:
            return state;

    }
}
