import Immutable from 'immutable';
import * as actions from './constants';

const initialState = Immutable.Map({
  "WALLET_SHARE_URL": "",
  "FLUJO_DE_FONDOS_URL": "",
  "VISOR_CONSOLIDATE_REPORT_URL": "",
  "TABLERO_DE_CONTROL_URL": ""
});

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.SET_URL_PARAMETER:
      return state.set(action.parameter, action.url);
    case actions.GET_ALL_CATEGORIES:
      return state.set("categories", action.payload.data.data);
    default:
      return state;
  }
}
