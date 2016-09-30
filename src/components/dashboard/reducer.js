import Immutable from 'immutable';
import {SAVE_DATA_LOADING} from './constants';

const initialState = Immutable.Map({
    showSaveData: false,
    messageData: '',
});

export default (state = initialState, action) => {
  switch (action.type) {
    case SAVE_DATA_LOADING:
      return state.withMutations(map => {
          map
          .set('showSaveData', action.value)
          .set('messageData', action.message)
      });
      break;
    default:
      return state;
  }
}
