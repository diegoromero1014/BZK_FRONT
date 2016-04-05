import Immutable from 'immutable';
import { VALIDATE_LOGIN } from './constants';

const initialState = Immutable.Map({
  status: "unlogin"
});

export default (state = initialState, action) => {
  switch (action.type) {
    case VALIDATE_LOGIN:
      console.log("action.payload: " + action.payload);
      console.log("action: " + action);
      return state.set("status","hola");
    default:
        return state;
  }
}
