import Immutable from 'immutable';
import {GET_CONTACT_LIST_CLIENT, CHANGE_KEYWORD, GET_CONTACT_DETAILS} from './constants';

const initialState = Immutable.Map({
    status: "processed",
    keyword: "",
    contacts: []
});


export default (state = initialState, action) => {
    switch (action.type) {
        case GET_CONTACT_LIST_CLIENT:
          const response = action.payload.data;
            return state.withMutations(map => {
                map
                .set('status', response.status)
                .set('rowCount', response.rowCount)
                .set('contacts', JSON.parse(response.contacts));
            });
        case CHANGE_KEYWORD:
            return state.set('keyword', action.keyword);
        case GET_CONTACT_DETAILS:
            break;
        default:
            return state;
    }
}
