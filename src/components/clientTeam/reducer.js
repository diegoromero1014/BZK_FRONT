import Immutable from 'immutable';
import * as actions from './constants';

const initialState = Immutable.Map({
    teamParticipants: []
});

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.TEAM_PARTICIPANTS:
      const response = action.payload.data;
        return state.withMutations(map => {
            map.set('teamParticipants', response);
        });
      case actions.SAVE_SENIOR_BANKER:
      const resp = action.payload.data;
        return state.withMutations(map=>{
            map.set('seniorBanker', resp);
        });
    default:
      return state;
  }
}
