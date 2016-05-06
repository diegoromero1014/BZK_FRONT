import Immutable from 'immutable';
import { GET_CONTACT_LIST_CLIENT,CHANGE_KEYWORD, CHANGE_PAGE,LIMITE_INF,CLEAR_CONTACT} from './constants';

const initialState = Immutable.Map({
    status: "processed",
    keyword: "",
    contacts: [],
    page: 1,
    limInf: 0
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
          case CHANGE_PAGE:
              return state.set('page', action.currentPage);
          case LIMITE_INF:
              return state.set('limInf', action.limInfe);
          case CLEAR_CONTACT:
          return state.withMutations(map => {
              map
              .set('page', 1)
              .set('limInf', 0);
          });
        default:
            return state;
    }
}
