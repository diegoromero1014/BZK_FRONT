import Immutable from 'immutable';
import * as actions from './constants';
import _ from 'lodash';

const initialState = Immutable.Map({
  economicGroupClients: []
});

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.CONSULT_RISK_GROUP:
      const response = action.payload.data.data;
      return state.withMutations(map => {
        map.set('riskGroupClients', response);
      });
    default:
      return state;
  }
}
