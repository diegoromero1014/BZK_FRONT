import Immutable from 'immutable';
import {GET_BUSINESS_PLAN_LIST, CHANGE_PAGE, LIMITE_INF, ORDER_COLUMN_BUSINESS_PLAN, CLEAR_BUSINESS_PLAN,
  CLEAR_BUSINESS_PLAN_PAGINATOR, CLEAR_BUSINESS_PLAN_ORDER,GET_DETAIL_BUSINESS,OWNER_DRAFT} from './constants';

const initialState = Immutable.Map({
  status: "processed",
  businessPlanList: [],
  rowCount: 0,
  limInf : 0,
  page: 1,
  columnBusinessPlan: 'initialValidityDate',
  orderBusinessPlan : 1,
  detailBusinessPlan: {},
  ownerDraft: 0
});

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_BUSINESS_PLAN_LIST:
  		const response = action.payload.data;
  		return state.withMutations(map => {
  			map.set('status', response.status)
  			.set('rowCount', response.data.rowCount)
  			.set('businessPlanList', response.data.rows);
  	  });
    case CHANGE_PAGE:
        return state.set('page', action.currentPage);
    case LIMITE_INF:
        return state.set('limInf', action.limInfe);
    case ORDER_COLUMN_BUSINESS_PLAN:
        return state.withMutations(map => {
            map.set('orderBusinessPlan', action.orderBusinessPlan)
                .set('columnBusinessPlan', action.columnBusinessPlan);
        });
    case CLEAR_BUSINESS_PLAN:
        return state.withMutations(map => {
            map.set('page', 1)
                .set('limInf', 0)
                .set('businessPlanList', [])
                .set('rowCount', 0)
                .set('orderBusinessPlan', 1)
                .set('columnBusinessPlan', 'initialValidityDate');
        });
    case CLEAR_BUSINESS_PLAN_PAGINATOR:
          return state.withMutations(map => {
              map
              .set('page', 1)
              .set('limInf', 0);
    });
    case CLEAR_BUSINESS_PLAN_ORDER:
        return state.withMutations(map => {
            map.set('orderBusinessPlan', 1)
                .set('columnBusinessPlan', 'initialValidityDate');
        });
    case GET_DETAIL_BUSINESS:
      return state.set('detailBusiness', action.payload.data);
    case OWNER_DRAFT:
        return state.set('ownerDraft', action.ownerDraft);
    default:
      return state;
  }
};
