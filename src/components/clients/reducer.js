import Immutable from 'immutable';
import {CLIENTS_FIND, CHANGE_PAGE, CHANGE_KEYWORD} from './constants';

const initialState = Immutable.Map({
    status: "withoutProcessing",
    keyword: "",
    page: 1,
    countClients: 0,
    responseClients: []
});

export default (state = initialState, action) => {
  switch (action.type) {
    case CLIENTS_FIND:
      const response = action.payload.data;
        return state.withMutations(map => {
            map
            .set('status', 'processed')
            .set('keyword', response.keyword)
            .set('countClients', response.countClients)
            .set('responseClients', JSON.parse(response.listClients));
        })
      break;
    case CHANGE_PAGE:
      return state.set('page', action.currentPage);
      break;
    case CHANGE_KEYWORD:
      return state.set('keyword', action.keyword);
      break;
    default:
    return state;
  }
}
