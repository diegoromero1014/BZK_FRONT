import Immutable from 'immutable';
import {
  CHANGE_IDPREVISIT, CLEAR_VISIT_PAGINATOR, CLEAR_VISIT, CLEAR_VISIT_ORDER,
  GET_VISIT_LIST_CLIENT, CHANGE_PAGE, LIMITE_INF, ORDER_COLUMN_VISIT,
  GET_DETAIL_VISIT, OWNER_DRAFT, GET_CSV_VISIT_BY_CLIENT, CLEAR_IDPREVISIT,
  CHANGE_PAGE_ASSOCIATE__VISIT
} from './constants';

const initialState = Immutable.Map({
  status: "processed",
  visitList: [],
  rowCount: 0,
  limInf: 0,
  idPrevisit: 0,
  page: 1,
  columnVisit: 'vd.visitTime',
  orderVisit: 1,
  detailVisit: {},
  ownerDraft: 0,
  pageAssociateVisit: 1
});

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_VISIT_LIST_CLIENT:
      const response = action.payload.data;
      return state.withMutations(map => {
        map
          .set('status', response.status)
          .set('rowCount', response.data.rowCount)
          .set('visitList',response.data.rows);
      });
    case CHANGE_PAGE:
      return state.set('page', action.currentPage);
    case CHANGE_IDPREVISIT:
      return state.set('idPrevisit', action.idPrevisit);
    case CLEAR_IDPREVISIT:
      return state.set('idPrevisit', 0);
    case LIMITE_INF:
      return state.set('limInf', action.limInfe);
    case ORDER_COLUMN_VISIT:
      return state.withMutations(map => {
        map
          .set('orderVisit', action.orderVisit)
          .set('columnVisit', action.columnVisit)
      });
    case CLEAR_VISIT:
      return state.withMutations(map => {
        map
          .set('page', 1)
          .set('limInf', 0)
          .set('visitList', [])
          .set('rowCount', 0)
          .set('orderVisit', 1)
          .set('columnVisit', "vd.visitTime");
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
      return state.set('detailVisit', action.payload.data);
    case GET_CSV_VISIT_BY_CLIENT:
      return state.set('status', "200");
    case OWNER_DRAFT:
      return state.set('ownerDraft', action.ownerDraft);
    case CHANGE_PAGE_ASSOCIATE__VISIT:
      return state.set('pageAssociateVisit', action.currentPage);
    default:
      return state;
  }
}
