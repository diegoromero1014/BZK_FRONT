import Immutable from 'immutable';
import {
    GET_PREVISIT_LIST, CHANGE_PAGE, LIMITE_INF, ORDER_COLUMN_PREVISIT,
    CLEAR_PREVISIT, CLEAR_PREVISIT_PAGINATOR, CLEAR_PREVISIT_ORDER, GET_DETAIL_PREVISIT, OWNER_DRAFT,
    ASK_EDIT_PREVISITA, DELETE_BLOCKED_PREVISITA, IS_CONFIDENTIAL
} from './constants';
import {orderBy} from 'lodash';

const initialState = Immutable.Map({
    status: "processed",
    previsitList: [],
    rowCount: 0,
    limInf: 0,
    page: 1,
    columnPrevisit: 'pvd.visitTime',
    orderPrevisit: 1,
    detailPrevisit: {},
    ownerDraft: 0,
    isBlocked: {}
});

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_PREVISIT_LIST:
            const response = action.payload.data;
            const orderedList = orderBy(response.data.rows,'datePrevisit','desc');
            return state.withMutations(map => {
                map.set('status', response.status)
                    .set('rowCount', response.data.rowCount)
                    .set('previsitList', orderedList);
            });
        case CHANGE_PAGE:
            return state.set('page', action.currentPage);
        case LIMITE_INF:
            return state.set('limInf', action.limInfe);
        case ORDER_COLUMN_PREVISIT:
            return state.withMutations(map => {
                map.set('orderPrevisit', action.orderPrevisit)
                    .set('columnPrevisit', action.columnPrevisit);
            });
        case GET_DETAIL_PREVISIT:
            return state.set('detailPrevisit', action.payload.data);
        case CLEAR_PREVISIT:
            return state.withMutations(map => {
                map.set('page', 1)
                    .set('limInf', 0)
                    .set('previsitList', [])
                    .set('rowCount', 0)
                    .set('columnPrevisit', 'pvd.visitTime');
            });
        case OWNER_DRAFT:
            return state.set('ownerDraft', action.ownerDraft);
        case CLEAR_PREVISIT_ORDER:
            return state.withMutations(map => {
                map.set('orderPrevisit', 1)
                    .set('columnPrevisit', 'pvd.visitTime');
            });
        case CLEAR_PREVISIT_PAGINATOR:
            return state.withMutations(map => {
                map.set('page', 1)
                    .set('limInf', 0)
            });

        case ASK_EDIT_PREVISITA:
            return state.set('isBlocked', action.payload.data)

        case DELETE_BLOCKED_PREVISITA:
            return state.set('isBlocked', action.payload.data)

        /* case IS_CONFIDENTIAL:
            return state.set('confidential', action.payload); */
        default:
            return state;
    }
};
