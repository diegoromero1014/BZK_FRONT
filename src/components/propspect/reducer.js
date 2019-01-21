import Immutable from 'immutable';
import { VALIDATE_PROSPECT_EXISTS, CLEAR_STATE_PROSPECT, CLEAR_ALL_PROSPECT, CREATE_PROSPECT, VALIDATE_NEED } from './constants';


const initialState = Immutable.Map({
  status: "OK",
  validateLogin: true,
  prospectExist: true,
  createProspect: 0
});

export default (state = initialState, action) => {
  switch (action.type) {
    case VALIDATE_PROSPECT_EXISTS:
      const { status, validateLogin, prospectExist } = action.payload.data;
      return state.withMutations(map => {
        map
          .set('validateLogin', validateLogin)
          .set('prospectExist', prospectExist)
          .set('status', status);
      });

    case CREATE_PROSPECT:
      const { responseCreateProspect } = action.payload.data;
      if (responseCreateProspect === "create") {
        return state.set("createProspect", 1);
      } else {
        return state.set("createProspect", 2);
      }

    case CLEAR_STATE_PROSPECT:
      return state.set("status", "OK");

    case CLEAR_ALL_PROSPECT:
      return state.withMutations(map => {
        map
          .set('validateLogin', true)
          .set('prospectExist', true)
          .set('status', "OK");
      });

    default:
      return state;
  }
}
