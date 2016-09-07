import Immutable from 'immutable';
import {SAVE_DATA_LOADING} from './constants';

const initialState = Immutable.Map({
    showSaveData: false,
});

export default (state = initialState, action) => {
  switch (action.type) {
    case SAVE_DATA_LOADING:
      return state.set('showSaveData', action.value);
      break;
    default:
      return state;
  }
}
