import Immutable from 'immutable';
import * as actions from './constants';

const initialState = Immutable.Map({
  "WALLET_SHARE_URL": "",
  "FLUJOS_DE_FONDOS_URL": "",
  "COMEX_URL": ""
});

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_URL_PARAMETER:
      return state.set(action.parameter, action.url);
    default:
      return state;
  }
}
