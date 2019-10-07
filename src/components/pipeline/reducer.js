import Immutable from 'immutable';
import {
    GET_PIPELINE_LIST, CHANGE_PAGE, LIMITE_INF, ORDER_COLUMN_PIPELINE,
    CLEAR_PIPELINE, CLEAR_PIPELINE_ORDER, CLEAR_PIPELINE_PAGINATOR, GET_PIPELINE, OWNER_DRAFT,
    UPDATE_DISBURSEMENT_PLANS, ORIGIN_PIPELIN_BUSINESS, SET_OPEN_PIPELINE_CHILD
} from './constants';
import { isUndefined } from 'lodash';

const initialState = Immutable.Map({
    status: "processed",
    previsitList: [],
    rowCount: 0,
    limInf: 0,
    page: 1,
    columnPrevisit: 'pe.startDate',
    orderPrevisit: 1,
    detailPipeline: {},
    ownerDraft: 0,
    disbursementPlans: [],
    childBusinessDisbursementPlans: [],
    isPipelineChildOpen: false
});

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_PIPELINE_LIST:
            const response = action.payload.data;
            return state.withMutations(map => {
                map.set('status', response.status)
                    .set('rowCount', response.rowCount)
                    .set('pipelineList', response.data.rows);
            });
        case CHANGE_PAGE:
            return state.set('page', action.currentPage);
        case LIMITE_INF:
            return state.set('limInf', action.limInfe);
        case ORDER_COLUMN_PIPELINE:
            return state.withMutations(map => {
                map.set('orderPipeline', action.orderPipeline)
                    .set('columnPipeline', action.columnPipeline);
            });
        case CLEAR_PIPELINE:
            return state.withMutations(map => {
                map.set('page', 1)
                    .set('limInf', 0)
                    .set('pipelineList', [])
                    .set('rowCount', 0)
                    .set('orderPipeline', 1)
                    .set('columnPipeline', 'pe.need');
            });
        case CLEAR_PIPELINE_PAGINATOR:
            return state.withMutations(map => {
                map
                    .set('page', 1)
                    .set('limInf', 0);
            });
        case CLEAR_PIPELINE_ORDER:
            return state.withMutations(map => {
                map.set('orderPipeline', 1)
                    .set('columnPipeline', 'pe.need');
            });
        case GET_PIPELINE:
            return state.set('detailPipeline', action.payload.data.data);
        case OWNER_DRAFT:
            return state.set('ownerDraft', action.ownerDraft);
        case UPDATE_DISBURSEMENT_PLANS:
            if (action.origin === ORIGIN_PIPELIN_BUSINESS) {
                return state.set('childBusinessDisbursementPlans', action.listDisbursementPlans);
            } else {
                return state.set('disbursementPlans', action.listDisbursementPlans);
            }
        case SET_OPEN_PIPELINE_CHILD:
            return state.withMutations(map => {
                map.set('isPipelineChildOpen', action.value)
            })
        default:
            return state;
    }
};
