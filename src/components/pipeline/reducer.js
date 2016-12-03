import Immutable from 'immutable';
import {GET_PIPELINE_LIST, CHANGE_PAGE, LIMITE_INF, ORDER_COLUMN_PIPELINE,
  CLEAR_PIPELINE, CLEAR_PIPELINE_ORDER,CLEAR_PIPELINE_PAGINATOR, GET_PIPELINE, OWNER_DRAFT} from './constants';
import {isUndefined} from 'lodash';

const initialState = Immutable.Map({
    status: "processed",
    previsitList: [],
    rowCount: 0,
    limInf : 0,
    page: 1,
    columnPrevisit: 'pe.startDate',
    orderPrevisit : 1,
    detailPipeline: {},
    ownerDraft: 0
});

export default (state = initialState, action) => {
	switch (action.type) {
	case GET_PIPELINE_LIST:
		const response = action.payload.data;
		return state.withMutations(map => {
			map.set('status', response.status)
			.set('rowCount', response.rowCount)
			.set('pipelineList', isUndefined(response.pipelineList) ? [] : JSON.parse(response.pipelineList));
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
                .set('columnPipeline', 'pe.startDate');
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
                .set('columnPipeline', 'pe.startDate');
        });
    case GET_PIPELINE:
        return state.set('detailPipeline', action.payload.data.data);
    case OWNER_DRAFT:
        return state.set('ownerDraft', action.ownerDraft);
    default:
    	return state;
    }
};
