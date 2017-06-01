import Immutable from 'immutable';
import * as actions from './constants';

const initialState = Immutable.Map({
    contextClient: null
});

export default (state = initialState, action) => {
    switch (action.type) {
        case actions.GET_CONTEXT_CLIENT:
            const response = action.payload.data;
            return state.withMutations(map => {
                map.set('contextClient', response.data)
            });
        default:
            return state;
    }
}
