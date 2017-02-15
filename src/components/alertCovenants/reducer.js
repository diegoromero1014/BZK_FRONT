/**
 * Created by user- on 11/23/2016.
 */
import Immutable from 'immutable';
import * as actions from './constants';
import {get} from 'lodash';

const initialState = Immutable.Map({
    status: "withoutProcessing",
    keywordNameNit: "",
    statusCovenant: 1,
    pageNum: 1,
    order: 0,
    columnOrder: '',
    responseCovenants: [],
    totalCovenantsByFiltered: 0
});

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case actions.FIND_ALERT_COVENANTS:
            const response = get(action.payload,'data.data',[]);
            return state.withMutations(map => {
                map
                    .set('status', 'processed')
                    .set('totalCovenantsByFiltered', get(response, 'rowCount',0))
                    .set('responseCovenants', get(response, 'rows',[]));
            });
        case actions.CHANGE_PAGE_FOR_COVENANTS:
            return state.set('pageNum', action.currentPage);
        case actions.CHANGE_KEYWORD_NAME_NIT_COVENANT:
            return state.set('keywordNameNit', action.keywordNameNit);
        case actions.CLEAR_FILTER_ALERT_COVENANT:
            const response2 = get(action.payload,'data.data',[]);
            return state.withMutations(map => {
                map
                    .set('status', 'processed')
                    .set('keywordNameNit', '')
                    .set('statusCovenant', null)
                    .set('pageNum', 1)
                    .set('columnOrder', '')
                    .set('totalCovenantsByFiltered', get(response2, 'rowCount',0))
                    .set('responseCovenants', get(response2, 'rows',[]));
            });
        case actions.CHANGE_STATUS_COVENANT:
            return state.withMutations(map => {
                map
                    .set('statusCovenant', action.statusCovenant);
            });
        case actions.CLEAR_CLIENT_ORDER:
            return state.withMutations(map => {
                map
                    .set('order', 0)
                    .set('columnOrder', "")
            });
        case actions.CLEAR_CLIENT_PAGINATION:
            return state.withMutations(map => {
                map
                    .set('pageNum', 1)
            });
        case actions.ORDER_COLUMN_CLIENT:
            return state.withMutations(map => {
                map
                    .set('order', action.order)
                    .set('columnOrder', action.columnOrder)
            });
        case actions.UPDATE_NUMBER_TOTAL_COVENANTS:
            return state.withMutations(map => {
                map
                    .set('totalCovenantsByFiltered', action.totalClients);
            });
        default:
            return state;
    }
}
