import Immutable from 'immutable';
import * as actions from './constants';
import {get} from 'lodash';

const initialState = Immutable.Map({
    status: "withoutProcessing",
    keywordNameNit: "",
    idTeam: null,
    idRegion: null,
    idZone: null,
    expirationType: null,
    line: null,
    pageNum: 1,
    order: 1,
    columnOrder: '',
    responseClients: [],
    totalClientsByFiltered: 0,
    lastUploadDate: null
});

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case actions.FIND_CLIENTS_PORTFOLIO_EXPIRATION:
            const uploadDate = get(action.payload,'data.data');
            const response = get(action.payload,'data.data.pagination',[]);
            return state.withMutations(map => {
                map
                    .set('status', 'processed')
                    .set('totalClientsByFiltered', get(response, 'rowCount',0))
                    .set('responseClients', get(response, 'rows',[]))
                    .set('lastUploadDate', get(uploadDate, 'lastUploadDate'));
                    
            }            
        );
        case actions.CHANGE_PAGE_FOR_ALERT_PORTFOLIO_EXPIRATION:
            return state.set('pageNum', action.currentPage);
        case actions.CHANGE_KEYWORD_NAME_NIT_PE:
            return state.set('keywordNameNit', action.keywordNameNit);
        case actions.CLEAR_FILTER_CLIENTS_PE:
            const uploadDate2 = get(action.payload,'data.data');
            const response2 = get(action.payload,'data.data.pagination',[]);
            return state.withMutations(map => {
                map
                    .set('status', 'processed')
                    .set('keywordNameNit', '')
                    .set('idTeam', null)
                    .set('idRegion', null)
                    .set('idZone', null)
                    .set('expirationType', null)
                    .set('line', null)
                    .set('pageNum', 1)
                    .set('columnOrder', '')
                    .set('totalClientsByFiltered', get(response2, 'rowCount',0))
                    .set('responseClients', get(response2, 'rows', []))
                    .set('lastUploadDate', get(uploadDate2, 'lastUploadDate'));
            });
        case actions.CHANGE_TEAM_PE:
            return state.withMutations(map => {
                map
                    .set('idTeam', action.idTeam);
            });
        case actions.CHANGE_REGION_PE:
            return state.withMutations(map => {
                map
                    .set('idRegion', action.idRegion);
            });
        case actions.CHANGE_ZONE_PE:
            return state.withMutations(map => {
                map
                    .set('idZone', action.idZone);
            });
        case actions.CHANGE_TYPE:
            return state.withMutations(map => {
                map
                    .set('expirationType', action.expirationType);
            });
        case actions.CHANGE_LINE:
            return state.withMutations(map => {
                map
                    .set('line', action.line);
            });
        case actions.CLEAR_CLIENT_ORDER_PE:
            return state.withMutations(map => {
                map
                    .set('order', 0)
                    .set('columnOrder', "")
            });
        case actions.CLEAR_CLIENT_PAGINATION_PE:
            return state.withMutations(map => {
                map
                    .set('pageNum', 1)
            });
        case actions.ORDER_COLUMN_CLIENT_PE:
            return state.withMutations(map => {
                map
                    .set('order', action.order)
                    .set('columnOrder', action.columnOrder)
            });
        case actions.UPDATE_NUMBER_TOTAL_CLIENTS_PE:
            return state.withMutations(map => {
                map
                    .set('totalClientsByFiltered', action.totalClients);
            });
        case actions.SAVE_OBSERVATIONS:
            // FALTA TO DO
            return state;
        default:
            return state;
    }
}
