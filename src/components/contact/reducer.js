import Immutable from 'immutable';
import { GET_CONTACT_LIST_CLIENT,CHANGE_KEYWORD} from './constants';

const initialState = Immutable.Map({
    status: "processed",
    keyword: "",
    contacts: []
});


export default (state = initialState, action) => {
    switch (action.type) {
        case GET_CONTACT_LIST_CLIENT:
            return state.withMutations(map => {
                map
                .set('status', 'processed')
                .set('rowCount', action.payload.data.messageBody.rowCount)
                .set('contacts', action.payload.data.messageBody.rows);
            });
          case CHANGE_KEYWORD:
            return state.set('keyword', action.keyword);
        default:
            return state;
    }
}
