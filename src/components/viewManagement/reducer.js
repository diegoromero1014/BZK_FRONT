import Immutable from 'immutable';
import {TAB_SELETED_ACTIVE, CONSULT_PIPELINE} from './constants';

const initialState = Immutable.Map({
    tabSeleted: 0,
    valuesPipelineConsult: []
});

export default (state = initialState, action) => {
  switch (action.type) {
    case TAB_SELETED_ACTIVE:
        return state.set('tabSeleted', action.tabSeleted);
    case CONSULT_PIPELINE:
        return state.set('valuesPipelineConsult', action.payload.data);
    default:
      return state;
  }
}
