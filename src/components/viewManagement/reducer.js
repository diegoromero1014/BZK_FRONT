import Immutable from 'immutable';
import {TAB_SELETED_ACTIVE, CONSULT_PIPELINE, CONSULT_PREVISIT,CONSULT_VISIT,CONSULT_CURRENCY, LOAD_CHART, CONSULT_BUSINESS_PLANS} from './constants';

const initialState = Immutable.Map({
    tabSeleted: 0,
    valuesPipelineConsult: [],
    valuesCurrency: [],
    loadChart: false,
    valuesPrevisitConsult: [],
    valuesVisitConsult : [],
    valuesBusinessPlans: []
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
    case CONSULT_PREVISIT:
        return state.set('valuesPrevisitConsult', action.payload.data);
    case CONSULT_VISIT:
        return state.set('valuesVisitConsult', action.payload.data);
    case CONSULT_BUSINESS_PLANS:
        return state.set('valuesBusinessPlans', action.payload.data);
    default:
      return state;
  }
}
