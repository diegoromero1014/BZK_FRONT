import Immutable from 'immutable';
import { UPDATE_ACTIVE_TAB_CS } from './constants';
import _ from 'lodash';

const initialState = Immutable.Map({
    tabSelected: null,
    listClientsDelivery: Immutable.List()
});

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ACTIVE_TAB_CS:
            return state.set("tabSelected", action.payload);
        default:
            return state;
    }
}
