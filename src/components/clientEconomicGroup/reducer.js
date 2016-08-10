import Immutable from 'immutable';
import * as actions from './constants';

const initialState = Immutable.Map({
  economicGroupClients: []
});

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.CONSULT_ECONOMIC_GROUP:
      const response = action.payload.data;
        return state.withMutations(map => {
            map.set('economicGroupClients', response);
        });
    default:
      return state;
  }
}
