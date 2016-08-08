import Immutable from 'immutable';
import {CHANGE_PAGE, LIMITE_INF, ORDER_COLUMN_BUSINESS_PLAN, CLEAR_BUSINESS_PLAN,
  CLEAR_BUSINESS_PLAN_PAGINATOR, CLEAR_BUSINESS_PLAN_ORDER} from './constants';

const initialState = Immutable.Map({
  status: "processed",
  businessPlanList: [],
  rowCount: 0,
  limInf : 0,
  page: 1,
  columnBusinessPlan: 'bp.startDate',
  orderBusinessPlan : 1,
  detailBusinessPlan: {},
  ownerDraft: 0
});

export default (state = initialState, action) => {
  switch (action.type) {
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
                .set('columnBusinessPlan', 'bp.startDate');
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
                .set('columnBusinessPlan', 'bp.startDate');
        });
    default:
      return state;
  }
};
