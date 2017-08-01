import Immutable from 'immutable';
import * as actions from './constants';
import _ from 'lodash';

const initialState = Immutable.Map({
  riskGroupClients: null,
  hasRiskGroup: false
});

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.CONSULT_RISK_GROUP:
      let response = action.payload.data.data;
      return state.withMutations(map => {
        map.set('riskGroupClients', response);
      });
    case actions.HAS_RISK_GROUP:
      return state.withMutations(map => {
        map.set('hasRiskGroup', action.payload.data.data);
      });
    default:
      return state;
  }
}
