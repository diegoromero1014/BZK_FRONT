import Immutable from 'immutable';
import {UPDATE_ACTIVE_TAB} from './constants';

const initialState = Immutable.Map({
  status: "200",
  tabSelected: null
});

export default(state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ACTIVE_TAB:
      return state.set("tabSelected", action.payload);
    default:
        return state;
  }
}
