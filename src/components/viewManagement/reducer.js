import Immutable from 'immutable';
import {TAB_SELETED_ACTIVE, CONSULT_PIPELINE, CONSULT_CURRENCY, LOAD_CHART} from './constants';

const initialState = Immutable.Map({
    tabSeleted: 0,
    valuesPipelineConsult: [],
    valuesCurrency: [],
    loadChart: false
});

export default (state = initialState, action) => {
  switch (action.type) {
    case TAB_SELETED_ACTIVE:
        return state.set('tabSeleted', action.tabSeleted);
    case CONSULT_PIPELINE:
        return state.set('valuesPipelineConsult', action.payload.data);
    case CONSULT_CURRENCY:
        return state.set('valuesCurrency', action.payload.data.data);
    case LOAD_CHART:
        return state.set('loadChart', action.loadChart);
    default:
      return state;
  }
}
