import * as actions from './constants';
import Immutable from 'immutable';

const initialState = Immutable.Map({
  status: "closed",
  "body": ""
});

export default (state = initialState, action) => {
  switch(action.type){
    case actions.TOGGLE_MESSAGE_BOX:
      const currentState = state.get("status");
      const newState = currentState === "closed" ? "opened": currentState;
      return state.withMutations(map => {
        map.set("status", newState);
        map.set("body", action.body);
      });
    default:
      return state;
  }
}
