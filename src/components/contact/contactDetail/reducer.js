import Immutable from 'immutable';
import _ from 'lodash';
import {
    GET_CONTACT_DETAILS, CLEAR_EDIT_CONTACT, SET_ARRAY_DELETE_CLIENT_CONTACT,
    DELETE_RELATOINSHIP_SERVER
} from '../constants';

const initialContactDetail = Immutable.Map({
    contactDetailList: {},
    listClientcontacts: [],
    listDeleteClientContact: []
});

export default (state = initialContactDetail, action) => {
    switch (action.type) {
        case GET_CONTACT_DETAILS:
            const response = action.payload.data;
            const contactDetail = response.data;
            const listClientcontacts = _.isNull(contactDetail) || _.isNull(contactDetail.listClientcontacts) ? [] : contactDetail.listClientcontacts;
            return state.withMutations(map => {
                map.set('contactDetailList', contactDetail)
                    .set('listClientcontacts', _.isUndefined(listClientcontacts) ? [] : listClientcontacts)
                    .set('listDeleteClientContact', [])
            });
        case CLEAR_EDIT_CONTACT:
            return state.set('contactDetailList', {});
        case SET_ARRAY_DELETE_CLIENT_CONTACT:
            return state.set('listDeleteClientContact', action.payload);
        case DELETE_RELATOINSHIP_SERVER:
            return state.withMutations(map => {
                map.set('listDeleteClientContact', []);
            });
        default:
            return state;
    }
}
