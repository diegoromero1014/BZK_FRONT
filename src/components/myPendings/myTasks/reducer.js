import Immutable from 'immutable';
import * as constants from './constants';
import _ from 'lodash';
import {CLEAR_TASK} from "../../pendingTask/constants";

const initialState = Immutable.Map({
    status: "processed",
    pendingTaskListByUser: [],
    page: 1,
    limInf: 0,
    rowCount: 0,
    orderMyPending: 0,
    columnMyPending: "",
    task: null,
    userName: null
});

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case constants.GET_INFO_USERTASK:
            var responseTask = action.payload.data;
            return state.withMutations(map => {
                map
                    .set('task', responseTask)
                    .set('userName', _.get(responseTask, 'data.userName'));

            });
        case CLEAR_TASK:
            return state.set('task', null);
        case constants.UPDATE_STATUS_TASK:
            return state.withMutations(map => {
                map
                    .set('page', 1)
                    .set('limInf', 0)
                    .set('rowCount', 0)
                    .set('pendingTaskListByUser', []);
            });
        default:
            return state;

    }
}
