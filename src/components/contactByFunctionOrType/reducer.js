import Immutable from 'immutable';
import * as actions from './constants';
import {get} from 'lodash';

const initialState = Immutable.Map({
    status: "withoutProcessing",
    idFunction: null,
    idType: null,
    idPosition: null,
    idDependency: null,
    pageNum: 1,
    order: 0,
    columnOrder: '',
    responseContacts: '',
    totalContactsFiltered: 0
});

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case actions.FIND_CONTACTS_BY_FUNCTION_OR_TYPE:
            const response = action.payload.data.data;
            return state.withMutations(map => {
                map
                    .set('status', 'processed')
                    .set('totalContactsFiltered', get(response, 'rowCount',0))
                    .set('responseContacts', JSON.parse(_.get(response,'contacts',[])));
            });
        case actions.CHANGE_PAGE_FOR_CONTACTS_BY_FUNCTION_OR_TYPE:
            return state.set('pageNum', action.currentPage);
        case actions.CLEAR_FILTERS_CONTACTS_BY_FUNCTION_OR_TYPE:
            return state.withMutations(map => {
                map
                    .set('status', 'processed')
                    .set('idFunction', null)
                    .set('idType', null)
                    .set('idPosition', null)
                    .set('idDependency', null)
                    .set('pageNum', 1)
                    .set('columnOrder', '')
                    .set('totalContactsFiltered',0)
                    .set('responseContacts', []);
            });
        case actions.CHANGE_FUNCTION_CONTACTS_BY_FUNCTION_OR_TYPE:
            return state.withMutations(map => {
                map
                    .set('idFunction', action.idFunction);
            });
        case actions.CHANGE_TYPE_CONTACTS_BY_FUNCTION_OR_TYPE:
            return state.withMutations(map => {
                map
                    .set('idType', action.idType);
            });
        case actions.CHANGE_TYPE_CONTACTS_BY_POSITION_OR_TYPE:
            return state.withMutations(map => {
                map
                    .set('idPosition', action.idPosition);
            });
        case actions.CHANGE_TYPE_CONTACTS_BY_DEPENDENCY_OR_TYPE:
            return state.withMutations(map => {
                map
                    .set('idDependency', action.idDependency);
            });
        case actions.CLEAR_ORDER_CONTACTS_BY_FUNCTION_OR_TYPE:
            return state.withMutations(map => {
                map
                    .set('order', 0)
                    .set('columnOrder', "")
            });
        case actions.CLEAR_PAGINATION_CONTACTS_BY_FUNCTION_OR_TYPE:
            return state.withMutations(map => {
                map
                    .set('pageNum', 1)
            });
        case actions.ORDER_COLUMN_CONTACTS_BY_FUNCTION_OR_TYPE:
            return state.withMutations(map => {
                map
                    .set('order', action.order)
                    .set('columnOrder', action.columnOrder)
            });
        default:
            return state;
    }
}
