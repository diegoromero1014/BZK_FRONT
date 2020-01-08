import Immutable from 'immutable';
import * as actions from './constants';
import {get} from 'lodash';

const initialState = Immutable.Map({
    status: "withoutProcessing",
    keywordNameNit: "",
    idTeam: null,
    idRegion: null,
    idZone: null,
    pageNum: 1,
    order: 0,
    columnOrder: '',
    responseClients: [],
    totalClientsByFiltered: 0
});

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case actions.CLIENTS_FIND_FOR_ALERT_PENDING_UPDATE:
            const response = get(action.payload,'data.data',[]);
            return state.withMutations(map => {
                map
                    .set('status', 'processed')
                    .set('totalClientsByFiltered', get(response, 'rowCount',0))
                    .set('responseClients', get(response, 'rows',[]));
            });
        case actions.CHANGE_PAGE_FOR_ALERT_PENDING_UPDATE:
            return state.set('pageNum', action.currentPage);
        case actions.CHANGE_KEYWORD_NAME_NIT:
            return state.set('keywordNameNit', action.keywordNameNit);
        case actions.CLEAR_FILTER_CLIENTS_PENDING_UPDATE:
            const response2 = get(action.payload,'data.data',[]);
            return state.withMutations(map => {
                map
                    .set('status', 'processed')
                    .set('keywordNameNit', '')
                    .set('idTeam', null)
                    .set('idRegion', null)
                    .set('idZone', null)
                    .set('pageNum', 1)
                    .set('columnOrder', '')
                    .set('totalClientsByFiltered', get(response2, 'rowCount',0))
                    .set('responseClients', get(response2, 'rows',[]));
            });
        case actions.CHANGE_TEAM:
            return state.withMutations(map => {
                map
                    .set('idTeam', action.idTeam);
            });
        case actions.CHANGE_REGION:
            return state.withMutations(map => {
                map
                    .set('idRegion', action.idRegion);
            });
        case actions.CHANGE_ZONE:
            return state.withMutations(map => {
                map
                    .set('idZone', action.idZone);
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
        case actions.UPDATE_NUMBER_TOTAL_CLIENTS:
            return state.withMutations(map => {
                map
                    .set('totalClientsByFiltered', action.totalClients);
            });
        default:
            return state;
    }
}
