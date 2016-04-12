import Immutable from 'immutable';
import { GET_CONTACT } from './constants';

const initialState = Immutable.Map({
    status: "processed",
    contacts: []
});

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_CONTACT:
            return state.withMutations(map => {
                map
                .set('status', 'processed')
                .set('contacts', action.payload.data);
            })
            break;
        default:
            return state;
    }
}
