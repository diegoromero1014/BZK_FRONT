import Immutable from 'immutable';
import {ORDER_COLUMN,GET_CONTACT_LIST_CLIENT,CHANGE_KEYWORD_CONTACT, CHANGE_PAGE,LIMITE_INF,CLEAR_CONTACT,CLEAR_CONTACT_DELETE} from './constants';

const initialState = Immutable.Map({
    status: "processed",
    keywordContact: "",
    contacts: [],
    page: 1,
    limInf: 0,
    order: 0,
    column:"",
    rowCount: 0
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
        case CHANGE_KEYWORD_CONTACT:
            return state.set('keywordContact', action.keywordContact);
          case CHANGE_PAGE:
              return state.set('page', action.currentPage);
          case LIMITE_INF:
              return state.set('limInf', action.limInfe);
          case CLEAR_CONTACT:
          return state.withMutations(map => {
              map
              .set('page', 1)
              .set('limInf', 0)
              .set('rowCount', 0)
              .set('contacts', []);
          });
          case CLEAR_CONTACT_DELETE:
          return state.withMutations(map => {
              map
              .set('page', 1)
              .set('limInf', 0)
          });
          case ORDER_COLUMN:
          return state.withMutations(map => {
              map
              .set('order', action.order)
              .set('column', action.column)});
        default:
            return state;
    }
}
