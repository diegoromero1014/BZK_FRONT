import Immutable from 'immutable';
import {
    GET_CONTACT_DETAILS, CLEAR_EDIT_CONTACT, SET_ARRAY_DELETE_CLIENT_CONTACT,
    DELETE_RELATOINSHIP_LOCAL, DELETE_RELATOINSHIP_SERVER
} from '../constants';
import _ from 'lodash';

const initialContactDetail = Immutable.Map({
    contactDetailList: {},
    listClientcontacts: [],
    listDeleteClientContact: []
});

export default (state = initialContactDetail, action) => {
    switch (action.type) {
        case GET_CONTACT_DETAILS:
            const response = action.payload.data;
            const contactDetail = JSON.parse(response.contactDetail);
            const listClientcontacts = _.isNull(contactDetail) || _.isNull(contactDetail.listClientcontacts) ? [] : contactDetail.listClientcontacts;
            return state.withMutations(map => {
                map
                    .set('contactDetailList', contactDetail)
                    .set('listClientcontacts', _.isUndefined(listClientcontacts) ? [] : listClientcontacts)
                    .set('listDeleteClientContact', [])
            });
        case CLEAR_EDIT_CONTACT:
            return state.set('contactDetailList', {});
        case SET_ARRAY_DELETE_CLIENT_CONTACT:
            return state.set('listDeleteClientContact', action.payload);
        case DELETE_RELATOINSHIP_SERVER:
            return state.withMutations(map => {
                map
                    .set('listDeleteClientContact', []);
            });
        case DELETE_RELATOINSHIP_SERVER:
            return state;
        default:
            return state;
    }
}
