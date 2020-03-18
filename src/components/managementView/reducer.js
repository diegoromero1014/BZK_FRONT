import Immutable from 'immutable';
import {TAB_SELETED_ACTIVE, CONSULT_PIPELINE, CONSULT_PREVISIT,CONSULT_VISIT, 
    CONSULT_BUSINESS_PLANS, CHANGE_ERROR_YEAR} from './constants';

const initialState = Immutable.Map({
    tabSeleted: 0,
    valuesPipelineConsult: [],
    loadChart: false,
    valuesPrevisitConsult: [],
    valuesVisitConsult : [],
    valuesBusinessPlans: [],
    errorYearSeleted: false
});

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case TAB_SELETED_ACTIVE:
        return state.set('tabSeleted', action.tabSeleted);
    case CONSULT_PIPELINE:
        return state.set('valuesPipelineConsult', action.payload.data);
    case CONSULT_PREVISIT:
        return state.set('valuesPrevisitConsult', action.payload.data);
    case CONSULT_VISIT:
        return state.set('valuesVisitConsult', action.payload.data);
    case CONSULT_BUSINESS_PLANS:
        return state.set('valuesBusinessPlans', action.payload.data);
    case CHANGE_ERROR_YEAR:
        return state.set('errorYearSeleted', action.value);
    default:
      return state;
  }
}
