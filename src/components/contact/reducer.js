import Immutable from 'immutable';
import {CLEAR_CONTACT_ORDER,CLEAR_CONTACT_CREAR,ORDER_COLUMN,GET_CONTACT_LIST_CLIENT,CHANGE_KEYWORD_CONTACT, CHANGE_PAGE,LIMITE_INF,CLEAR_CONTACT,CLEAR_CONTACT_PAGINATOR} from './constants';

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
              .set('contacts', [])
              .set('order', 0)
              .set('column',"");
          });
          case CLEAR_CONTACT_PAGINATOR:
          return state.withMutations(map => {
              map
              .set('page', 1)
              .set('limInf', 0)
          });
          case CLEAR_CONTACT_ORDER:
          return state.withMutations(map => {
              map
              .set('order', 0)
              .set('column', "")
          });
          case CLEAR_CONTACT_CREAR:
          return state.withMutations(map => {
              map
              .set('page', 1)
              .set('limInf', 0)
              .set('keywordContact','')
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
