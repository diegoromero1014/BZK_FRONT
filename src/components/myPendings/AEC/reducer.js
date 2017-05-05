import Immutable from 'immutable';
import * as constants from './constants';
import _ from 'lodash';

const initialState = Immutable.Map({
    status: "processed",
    AECList: [],
    page: 1,
    detailAEC: {},
    limInf: 0,
    rowCount: 0
});


export default (state = initialState, action = {}) => {
    switch (action.type) {
        case constants.GET_AEC_FOR_EMPLOYEE:
            const response = action.payload.data;
            return state.withMutations(map => {
                map
                    .set('status', response.status)
                    .set('rowCount', _.get(response, 'data.rowCount', 0))
                    .set('AECList', _.get(response, 'data.rows', []));
            });
        case constants.GET_DETAIL_AEC:
            const responseDetail = action.payload.data;
            return state.set('detailAEC', responseDetail.data);
        case constants.CLEAR_DETAIL_AEC:
            return state.set('detailAEC', {});
        case constants.CHANGE_PAGE:
            return state.set('page', action.currentPage);
        case constants.LIMITE_INF:
            return state.set('limInf', action.limInfe);
        default:
            return state;
    }
}
