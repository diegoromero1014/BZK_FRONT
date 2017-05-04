import Immutable from 'immutable';
import * as constants from './constants';
import _ from 'lodash';

const initialState = Immutable.Map({
    status: "withoutProcessing",
    keyword: "",
    page: 1,
    countContacts: 0,
    responseContacts: [],
    modalIsOpen: false,
    modalCreateIsOpen: false,
    entityClientContact: {},
    clientsCreaterRelationship: []
});

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case constants.FILTER_CONTACTS:
            const response = action.payload.data;
            return state.withMutations(map => {
                map
                    .set('status', 'processed')
                    .set('countContacts', response.data === null ? null : response.data.countContact)
                    .set('responseContacts', response.data === null || response.data.listContact === undefined ? [] : response.data.listContact);
            });
        case constants.CHANGE_PAGE:
            return state.set('page', action.currentPage);
        case constants.CHANGE_KEYWORD:
            return state.set('keyword', action.keyword);
        case constants.CHANGE_VALUE_IS_OPEN:
            if( _.isEqual(constants.OPEN_CREATE_MODAL, action.typeModal) ){
                return state.set('modalCreateIsOpen', action.payload);
            } else {
                return state.set('modalIsOpen', action.payload);
            }
        case constants.SET_EDIT_RELATIONSHIP:
            return state.set('entityClientContact', action.payload);
        case constants.CLEAR_CONTACTS:
            return state.withMutations(map => {
                map
                    .set('status', 'withoutProcessing')
                    .set('keyword', '')
                    .set('page', 1)
                    .set('countContacts', 0)
                    .set('responseContacts', []);
            });
        case constants.MODIFY_CLIENT_RELATIONSHIP:
            return state.set('clientsCreaterRelationship', action.payload);
        default:
            return state;
    }
}