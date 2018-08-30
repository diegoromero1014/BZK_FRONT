import Immutable from 'immutable';
import * as actions from './constants';
import _ from 'lodash';

const initialState = Immutable.Map({
  economicGroupClients: []
});

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.CONSULT_ECONOMIC_GROUP:
      const response = action.payload.data.data;
      response.listClients = _.remove(_.get(response, 'listClients', []), client => !_.isEqual(client.id, response.idClientNitPrincipal));
      return state.withMutations(map => {
        map.set('economicGroupClients', response);
      });
    default:
      return state;
  }
}
