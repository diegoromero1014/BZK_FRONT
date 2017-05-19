import Immutable from 'immutable';
import * as constants from './constants';
import _ from 'lodash';

const initialState = Immutable.Map({
    status: "processed",
    assigned: [],
    page: 1,
    limInf: 0,
    rowCount: 0,
    sortOrder: 0,
    clientNumberOrName: null,
    statusOfTask: null,
    homeworkTime: null
});

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case constants.GET_ASSIGNED:
            const response = action.payload.data;
            return state.withMutations(map => {
                map.set('status', response.status)
                    .set('rowCount', _.get(response, 'data.rowCount', 0))
                    .set('assigned', _.get(response, 'data.rows', []));
            });
        case constants.CHANGE_PAGE:
            return state.set('page', action.currentPage);
        case constants.LIMITE_INF:
            return state.set('limInf', action.limInfe);
        case constants.CLEAR_LIST_OF_ASSIGNED:
            return state.withMutations(map => {
                map.set('assigned', [])
                    .set('rowCount', 0)
                    .set('limInf', 0)
                    .set('page', 1)
            });
        case constants.CHANGE_SORT_ORDER:
            return state.set('sortOrder', action.sortOrder);
        case constants.CHANGE_CLIENT_NUMBER_OR_NAME:
            return state.set('clientNumberOrName', action.clientNumberOrName);
        case constants.CHANGE_STATE:
            return state.set('statusOfTask', action.state);
        case constants.CHANGE_HOMEWORK_TIME:
            return state.set('homeworkTime', action.homeworkTime);
        default:
            return state;
    }
}
