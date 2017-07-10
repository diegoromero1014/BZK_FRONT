import Immutable from 'immutable';
import * as actions from './constants';

const initialState = Immutable.Map({
  status: "withoutProcessing",
  keyword: "",
  page: 1,
  countClients: 0,
  responseClients: []
});

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.CLIENTS_FIND:
      const response = action.payload.data.data;
      return state.withMutations(map => {
        map
          .set('status', 'processed')
          .set('countClients', response.rowCount)
          .set('responseClients', response.rows);
      });
    case actions.CHANGE_PAGE:
      return state.set('page', action.currentPage);
    case actions.CHANGE_KEYWORD:
      return state.set('keyword', action.keyword);
    case actions.CLEAR_CLIENTS:
      return state.withMutations(map => {
        map
          .set('status', 'withoutProcessing')
          .set('keyword', '')
          .set('countClients', 0)
          .set('responseClients', []);
      });
    case actions.GET_RECENT_CLIENTS:
      const responseRecentClients = action.payload.data.data;
      return state.withMutations(map => {
        map
          .set('status', 'processed')
          .set('countClients', responseRecentClients.rowCount)
          .set('responseClients', responseRecentClients.rows);
      });
    default:
      return state;
  }
}
