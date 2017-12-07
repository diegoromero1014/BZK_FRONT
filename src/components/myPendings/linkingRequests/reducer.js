import Immutable from 'immutable';
import * as constants from './constants';
import _ from 'lodash';

const initialState = Immutable.Map({
    listLinkRequests: [],
    observationsByLinkingRequests: [],
    rowCount: 0,
    page: 1,
    limInf: 0,
});

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case constants.GET_LINK_REQUESTS:
            const response = action.payload.data;
            return state.withMutations(map => {
                map.set('listLinkRequests', response.data.rows)
                    .set('rowCount', response.data.rowCount);
            });
        case constants.GET_OBSERVATIONS_BY_LINKING_REQUESTS:
            const responseObservations = action.payload.data;
            return state.withMutations(map => {
                map.set('observationsByLinkingRequests', responseObservations.data);
            });
        case constants.CHANGE_PAGE:
            return state.set('page', action.currentPage);
        case constants.LIMITE_INF:
            return state.set('limInf', action.limInfe);
        case constants.CLEAR_LIST_OBSERVATIONS:
            return state.set('observationsByLinkingRequests', []);
        default:
            return state;
    }
}
