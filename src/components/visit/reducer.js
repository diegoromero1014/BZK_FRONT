import Immutable from 'immutable';
import {CLEAR_VISIT_PAGINATOR,CLEAR_VISIT,CLEAR_VISIT_ORDER,CLEAR_VISIT_CREATE,GET_VISIT_LIST_CLIENT,CHANGE_PAGE,LIMITE_INF,ORDER_COLUMN_VISIT, GET_DETAIL_VISIT} from './constants';

const initialState = Immutable.Map({
    status: "processed",
    visitList: [],
    rowCount:0,
    limInf : 0,
    page:1,
    columnVisit: 'vd.visitTime',
    orderVisit : 1,
    detailVisit: {}
});

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_VISIT_LIST_CLIENT:
      const response = action.payload.data;
      return state.withMutations(map => {
          map
          .set('status', response.status)
          .set('rowCount', response.rowCount)
          .set('visitList', JSON.parse(response.visitList));
      });
    case CHANGE_PAGE:
      return state.set('page', action.currentPage);
    case LIMITE_INF:
      return state.set('limInf', action.limInfe);
    case ORDER_COLUMN_VISIT:
      return state.withMutations(map => {
          map
          .set('orderVisit', action.orderVisit)
          .set('columnVisit', action.columnVisit)});
    case CLEAR_VISIT:
      return state.withMutations(map => {
        map
          .set('page', 1)
          .set('limInf', 0)
          .set('visitList', [])
          .set('rowCount', 0)
          .set('orderVisit', 1)
          .set('columnVisit',"vd.visitTime");
        });
    case CLEAR_VISIT_PAGINATOR:
      return state.withMutations(map => {
          map
          .set('page', 1)
          .set('limInf', 0);
      });
    case CLEAR_VISIT_ORDER:
      return state.withMutations(map => {
          map
          .set('orderVisit', 1)
          .set('columnVisit', "vd.visitTime")
        });
    case GET_DETAIL_VISIT:
      console.log("payload", action.payload);
      return state.set('detailVisit', action.payload.data);
    default:
      return state;
  }
}
