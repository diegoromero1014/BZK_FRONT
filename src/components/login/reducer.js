import Immutable from 'immutable';
import { VALIDATE_LOGIN, CHANGE_STATUS_LOGIN } from './constants';

const initialState = Immutable.Map({
  status: "unloggerIn",
  responseLogin: {},
  idRol: null,
  validateLogin: false,
  error: false,
  errorServerNoFound: false
});

export default (state = initialState, action) => {
  switch (action.type) {
    case VALIDATE_LOGIN:
      if( action.payload.data === {} || action.payload.data === undefined ){
        return state.set("errorServerNoFound", true);
      }
      const {redirecUrl, sessionToken} = action.payload.data.data;
      if( redirecUrl === "/login" && sessionToken === ""){
        return state.withMutations( map => {
          map
            .set('status', 'unloggerInPetition')
            .set('responseLogin', "")
            .set('validateLogin', false)
            .set('idRol', null)
            .set('error', true);
        });
      } else {
        const {idRol} = action.payload.data.data;
        return state.withMutations( map => {
          map
            .set('status', 'loggedIn')
            .set('responseLogin', action.payload.data.data)
            .set('validateLogin', false)
            .set('idRol', idRol)
            .set('error', false)
        });
      }
      break;

    case CHANGE_STATUS_LOGIN:
      return state.withMutations( map => {
        map
          .set('errorServerNoFound', false)
          .set('error', false)
          .set('status', "unloggerIn")
      });

    default:
        return state.set("status", "unloggerIn");
  }
}
