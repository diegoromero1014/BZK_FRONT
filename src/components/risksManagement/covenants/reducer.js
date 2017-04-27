import Immutable from 'immutable';
import * as actions from './constants';
import { get } from 'lodash';

const initialState = Immutable.Map({
    status: "withoutProcessing",
    showFormCreatetracking: false,
    responseCovenant: [],
    covenantInfo: {},
    trackingCovenant: []
});

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case actions.CLIENTS_COVENANTS:
            const response = get(action.payload, 'data', []);
            return state.withMutations(map => {
                map.set('status', 'processed')
                    .set('responseCovenant', get(response, 'data', []));
            });
        case actions.CONSULT_INFO_COVENANT:
            const responseInfo = get(action.payload, 'data', []);
            return state.withMutations(map => {
                map.set('covenantInfo', get(responseInfo, 'data', []))
                    .set('trackingCovenant', get(responseInfo.data, 'listTrackingCovenant', []));
            });
        case actions.CLEAR_COVENANT:
            return state.set('covenantInfo', {});
        case actions.CHANGE_STATUS_CREATE:
            return state.set('showFormCreatetracking', action.value);
        default:
            return state;
    }
}
