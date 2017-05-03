import Immutable from 'immutable';
import { UPDATE_ACTIVE_TAB_RISKS_MANAGMENT } from './constants';
import _ from 'lodash';

const initialState = Immutable.Map({
    tabSelected: null
});

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ACTIVE_TAB_RISKS_MANAGMENT:
            return state.set("tabSelected", action.payload);
        default:
            return state;
    }
}
