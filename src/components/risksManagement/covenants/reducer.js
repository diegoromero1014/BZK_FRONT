/**
 * Created by IAS-ASUS on 2/2/2017.
 */
import Immutable from 'immutable';
import * as actions from './constants';
import { get } from 'lodash';

const initialState = Immutable.Map({
    status: "withoutProcessing",
    responseCovenant: [],
    covenantInfo: {},
    trackingCovenant: Immutable.List()
});

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case actions.CLIENTS_COVENANTS:
            const response = get(action.payload, 'data', []);
            return state.withMutations(map => {
                map
                    .set('status', 'processed')
                    .set('responseCovenant', get(response, 'data', []));
            });
        case actions.CONSULT_INFO_COVENANT:
            const responseInfo = get(action.payload, 'data', []);
            return state.set('covenantInfo', get(responseInfo, 'data', []));
        case actions.CLEAR_COVENANT:
            return state.set('covenantInfo', {});
        default:
            return state;
    }
}
