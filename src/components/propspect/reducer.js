import Immutable from 'immutable';
import { VAIDATE_PROSPECT_EXISTS } from './constants';


const initialState = Immutable.Map({
  status: "200",
  validateLogin: true,
  prospectExist: false
});

export default (state = initialState, action) => {
  switch (action.type) {
    case VAIDATE_PROSPECT_EXISTS:
    const {status, validateLogin, prospectExist} = action.payload.data;
    return state.withMutations( map => {
      map
        .set('validateLogin', validateLogin)
        .set('prospectExist', prospectExist)
        .set('status', status);
    });

    default:
        return state;
  }
}
