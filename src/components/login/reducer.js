import Immutable from 'immutable';
import { VALIDATE_LOGIN } from './constants';

const initialState = Immutable.Map({
  status: "unloggerIn",
  responseLogin: {},
  validateLogin: false,
  error: false
});

export default (state = initialState, action) => {
  switch (action.type) {
    case VALIDATE_LOGIN:
      const {redirecUrl, sessionToken} = action.payload.data;
      if( redirecUrl === "/login" && sessionToken === ""){
        return state.withMutations( map => {
          map
            .set('status', 'unloggerInPetition')
            .set('responseLogin', "")
            .set('validateLogin', false)
            .set('error', true);
        })
      } else {
        return state.withMutations( map => {
          map
            .set('status', 'loggedIn')
            .set('responseLogin', action.payload.data)
            .set('validateLogin', false)
            .set('error', false)
        })
      }
      //return state.set("responseLogin",action.payload.data);
    default:
        return state;
  }
}
