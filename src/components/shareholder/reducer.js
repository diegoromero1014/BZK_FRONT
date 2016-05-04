import Immutable from 'immutable';
import {GET_SHAREHOLDERS_LIST_CLIENT,CHANGE_KEYWORD} from './constants';

const initialState = Immutable.Map({
    status: "processed",
    shareholders: [],
    keyword: ""
});


export default (state = initialState, action) => {
    switch (action.type) {
        case GET_SHAREHOLDERS_LIST_CLIENT:
          const response = action.payload.data;
            return state.withMutations(map => {
                map
                .set('status', response.status)
                .set('rowCount', response.rowCount)
                .set('shareholders', JSON.parse(response.shareholders));
            });
            case CHANGE_KEYWORD:
                return state.set('keyword', action.keyword);
        default:
            return state;
    }
}
