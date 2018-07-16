import Immutable from 'immutable';
import * as actions from './constants';
import _ from 'lodash';


const initialState = Immutable.Map({
  status: "withoutProcessing",
  keyword: "",
  page: 1,
  countClients: 0,
  responseClients: [],
  showingRecentClients: true,
  filterValues: []
});

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.CLIENTS_FIND:
      const response = action.payload.data.data;
      return state.withMutations(map => {
        map
          .set('status', 'processed')
          .set('countClients', response.rowCount)
          .set('responseClients', response.rows)
          .set('showingRecentClients', false);
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
      var showingRecentClients = true;
      if (responseRecentClients.rowCount === 0) {
        showingRecentClients = false;
      }
      return state.withMutations(map => {
        map
          .set('countClients', responseRecentClients.rowCount)
          .set('responseClients', responseRecentClients.rows)
          .set('showingRecentClients', showingRecentClients);
      });
    case actions.CLIENTS_FIND_TYPE_NUMBER_BASIC:
      let responseClients = action.payload.data.data;
      return state.withMutations(map => {
        map
          .set('clientsBasicInfo', responseClients.rows);
      });
    case actions.SAVE_FILTER:
      const filter = action.data;
      const name = filter.name;
      const value = filter.value;
      const newItem = {
        name: name,
        value: value
      }
      let list = state.get("filterValues");
      let listFilter = _.filter(list, function (element) {
        return (element.name === name);
      });
      if (_.isEmpty(listFilter)) {
        list.push(newItem);
      } else {
        list = list.map((element) => {
          if (element.name === name) {
            element.value = value;
          }
          return element;
        })
      }
      return state.withMutations(map => {
        map.set('filterValues', list);
      })
    default:
      return state;
  }
}
