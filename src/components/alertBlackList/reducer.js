/**
 * Created by Andres Hurtado on 01/03/2017.
 */
import Immutable from 'immutable';
import * as actions from './constants';
import {get} from 'lodash';

const initialState = Immutable.Map({
    status: "withoutProcessing",
    keywordNameNit: "",
    keywordNameNitClient: "",
    typeEntity: null,
    pageNum: 1,
    order: 0,
    columnOrder: '',
    responseBlackList:  [],
    totalBlackListFiltered: 0
});

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case actions.FIND_ALERT_BLACK_LIST:
            const response = get(action.payload,'data.data',[]);
            return state.withMutations(map => {
                map
                    .set('status', 'processed')
                    .set('totalBlackListFiltered', get(response, 'rowCount',0))
                    .set('responseBlackList', get(response, 'rows',[]));
            });
        case actions.CHANGE_PAGE_FOR_BLACK_LIST:
            return state.set('pageNum', action.currentPage);
        case actions.CHANGE_KEYWORD_NAME_NIT_BLACK_LIST:
            return state.set('keywordNameNit', action.keywordNameNit);
        case actions.CHANGE_KEYWORD_NAME_NIT_BLACK_LIST_CLIENT:
            return state.set('keywordNameNitClient', action.keywordNameNitClient);
        case actions.CLEAR_FILTER_ALERT_BLACK_LIST:
            const response2 = get(action.payload,'data.data',[]);
            return state.withMutations(map => {
                map
                    .set('status', 'processed')
                    .set('keywordNameNit', '')
                    .set('keywordNameNitClient', '')
                    .set('typeEntity', null)
                    .set('pageNum', 1)
                    .set('columnOrder', '')
                    .set('totalBlackListFiltered', get(response2, 'rowCount',0))
                    .set('responseBlackList', get(response2, 'rows',[]));
            });
        case actions.CHANGE_TYPE_ENTITY_BLACK_LIST:
            return state.withMutations(map => {
                map
                    .set('typeEntity', action.typeEntity);
            });
        case actions.CLEAR_CLIENT_ORDER_BLACK_LIST:
            return state.withMutations(map => {
                map
                    .set('order', 0)
                    .set('columnOrder', "")
            });
        case actions.CLEAR_CLIENT_PAGINATION_BLACK_LIST:
            return state.withMutations(map => {
                map
                    .set('pageNum', 1)
            });
        case actions.ORDER_COLUMN_CLIENT_BLACK_LIST:
            return state.withMutations(map => {
                map
                    .set('order', action.order)
                    .set('columnOrder', action.columnOrder)
            });
        case actions.UPDATE_NUMBER_TOTAL_BLACK_LIST:
            return state.withMutations(map => {
                map
                    .set('totalBlackListFiltered', action.totalClients);
            });
        default:
            return state;
    }
}
