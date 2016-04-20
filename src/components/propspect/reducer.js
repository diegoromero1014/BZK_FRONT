import Immutable from 'immutable';
import { VAIDATE_PROSPECT_EXISTS, CLEAR_STATE_PROSPECT } from './constants';


const initialState = Immutable.Map({
  status: "OK",
  validateLogin: true,
  prospectExist: false
});

export default (state = initialState, action) => {
  switch (action.type) {
    case VAIDATE_PROSPECT_EXISTS:
    console.log(" action.payload.data", action.payload.data);
    const {status, validateLogin, prospectExist} = action.payload.data;
    return state.withMutations( map => {
      map
        .set('validateLogin', validateLogin)
        .set('prospectExist', prospectExist)
        .set('status', status);
    });
    case CLEAR_STATE_PROSPECT:
      return state.set("status", "OK");
    default:
        return state;
  }
}
