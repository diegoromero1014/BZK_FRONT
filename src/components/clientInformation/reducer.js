import Immutable from 'immutable';
import {CONSULT_INFO_CLIENT, CHANGE_CHECK_CLIENT, UPDATE_ACTIVE_TAB} from './constants';

const initialState = Immutable.Map({
  status: "200",
  validateLogin: true,
  responseClientInfo: {},
  tabSelected: null,
  economicGroup: null
});

export default(state = initialState, action) => {
  switch (action.type) {
    case CONSULT_INFO_CLIENT:
      const {status, validateLogin, clientInformation} = action.payload.data;
      return state.withMutations(map => {
          map
          .set('status', status)
          .set('validateLogin', validateLogin)
          .set('responseClientInfo', JSON.parse(clientInformation));
      })

    case UPDATE_ACTIVE_TAB:
      return state.set("tabSelected", action.payload);

    case CHANGE_CHECK_CLIENT:
      const data = action.payload;
      var responseClientInfo = state.get('responseClientInfo')
      if( responseClientInfo !== null && responseClientInfo !== undefined ){
        responseClientInfo.certificateNoShareholder = data;
        return state.set("responseClientInfo", responseClientInfo);
      } else {
        return state;
      }
    default:
        return state;
  }
}
