import Immutable from 'immutable';
import {NON_VALIDATE_ENTER} from './constantsGlobal';

const initialState = Immutable.Map({
  validateEnter: true
});

export default (state = initialState, action) => {
  switch (action.type) {
    case NON_VALIDATE_ENTER:
      return state.set('validateEnter', action.payload);
    default:
      return state;
  }
}
