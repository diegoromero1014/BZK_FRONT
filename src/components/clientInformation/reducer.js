import Immutable from 'immutable';
import {CONSULT_INFO_CLIENT} from './constants';

const initialState = Immutable.Map({
  status: "200",
  validateLogin: true,
  responseClientInfo: {}
});

export default(state = initialState, action) => {
  switch (action.type) {
    case CONSULT_INFO_CLIENT:
      const {status, validateLogin, clientInformation} = action.payload.data;
      return state.withMutations(map => {
          map
          .set('status', satus)
          .set('validateLogin', validateLogin)
          .set('responseClientInfo', JSON.parse(clientInformation));
      })
    default:
        return state;
  }
}
