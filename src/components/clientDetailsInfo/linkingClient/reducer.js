/**
 * Created by Andres Hurtado on 23/03/2017.
 */
import Immutable from 'immutable';
import {CONSULT_BLACK_LIST_CLIENT,UPDATE_VALUES_BLACKLIST} from './actions';
import _ from 'lodash';

const initialState = Immutable.Map({
    level: '',
    message: ''
});

export default (state = initialState, action) => {
    switch (action.type) {
        case CONSULT_BLACK_LIST_CLIENT:
            // const response = action.payload.data.data;
            return state.withMutations(map => {
                map.set('level', null)
                    .set('message', null);
            });
        case UPDATE_VALUES_BLACKLIST:
            return state.withMutations(map => {
                map.set('level', action.level)
                    .set('message', action.message);
            });
        default:
            return state;
    }
}

