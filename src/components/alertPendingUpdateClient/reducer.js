/**
 * Created by user- on 11/23/2016.
 */
import Immutable from 'immutable';
import * as actions from './constants';

const initialState = Immutable.Map({
    status: "withoutProcessing",
    keywordNameNit: "",
    page: 1,
    countClients: 0,
    responseClients: []
});

export default (state = initialState, action) => {
    switch (action.type) {
        case actions.CLIENTS_FIND_FOR_ALERT_PENDING_UPDATE:
            const response = action.payload.data;
            return state.withMutations(map => {
                map
                    .set('status', 'processed')
                    .set('countClients', response.countClients)
                    .set('responseClients', response.listClients === undefined ? [] : JSON.parse(response.listClients));
            });
        case actions.CHANGE_PAGE_FOR_ALERT_PENDING_UPDATE:
            return state.set('page', action.currentPage);
        case actions.CHANGE_KEYWORD_NAME_NIT:
            return state.set('keywordNameNit', action.keywordNameNit);
        case actions.CLEAR_FILTER:
            return state.withMutations(map => {
                map
                    .set('status', 'withoutProcessing')
                    .set('keywordNameNit', '')
                    .set('countClients', 0)
                    .set('responseClients', []);
            });
        default:
            return state;
    }
}
