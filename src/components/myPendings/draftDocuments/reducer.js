import Immutable from 'immutable';
import * as constants from './constants';
import _ from 'lodash';

const initialState = Immutable.Map({
    status: "processed",
    draftDocumentsListByUser: [],
    page: 1,
    document: null,
    limInf: 0,
    rowCount: 0,
    orderDrafts: 0,
    columnDrafts: "",
    modalIsOpen: false
});

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case constants.FIND_DRAFT_DOCUMENTS:
            const response = action.payload.data;

            return state.withMutations(map => {
                map
                    .set('status', response.status)
                    .set('rowCount', _.get(response, 'data.rowCount', 0))
                    .set('draftDocumentsListByUser', _.get(response, 'data.rows', []));
            });
        case constants.CHANGE_PAGE:
            return state.set('page', action.currentPage);
        case constants.UPDATE_MODAL_IS_OPEN:
            return state.set('modalIsOpen', action.modalIsOpen);
        case constants.LIMITE_INF:
            return state.set('limInf', action.limInfe);
        case constants.GET_INFO_DOCUMENT:
            var responseTask = action.payload.data;
            return state.set('document', responseTask);
        case constants.CLEAR_DRAFT_DOCUMENTS_ORDER:
            return state.withMutations(map => {
                map
                    .set('orderDrafts', 0)
                    .set('columnDrafts', "")
            });
        case constants.CLEAR_DRAFT_DOCUMENTS_PAGINATOR:
            return state.withMutations(map => {
                map
                    .set('page', 1)
                    .set('limInf', 0);
            });
        case constants.CLEAR_DRAFT_DOCUMENTS:
            return state.withMutations(map => {
                map
                    .set('page', 1)
                    .set('limInf', 0)
                    .set('rowCount', 0)
                    .set('draftDocumentsListByUser', []);
            });
        case constants.ORDER_COLUMN_DRAFT_DOCUMENTS:
            return state.withMutations(map => {
                map
                    .set('orderDrafts', action.orderDrafts)
                    .set('columnDrafts', action.columnDrafts)
            });
        default:
            return state;
    }
}
