import Immutable from 'immutable';
import _ from 'lodash';
import * as actions from './constants';

const initialState = Immutable.Map(
    {
        listAlertByUser: Immutable.List(),
        openModal: false
    }
);

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case actions.GET_ALERT_BY_USER:
            const response = action.payload.data;
            return state.withMutations(map => {
                map.set('listAlertByUser', _.get(response, "data", []));
            });
        case actions.OPEN_MODAL_ALERTS:
            return state.withMutations(map => {
                map.set('openModal', action.open)
            });
        case actions.CLEAR_MODAL_ALERTS:
            return state.withMutations(map => {
                map.set('listAlertByUser', [])
            });
        default:
            return state;
    }
}