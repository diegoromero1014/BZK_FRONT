/**
 * Created by user- on 11/23/2016.
 */
import Immutable from 'immutable';
import * as actions from './constants';
import {get} from 'lodash';

const initialState = Immutable.Map({
    status: "withoutProcessing",
    keywordName: "",
    pageNum: 1,
    responseGroup: [],
    totalGroupByFiltered: 0,
    validExistGroup: false,
    viewEmailGroup: '',
    group: Immutable.Map({
        id: '',
        name: '',
        listContact: []
    }),
    contact: {
        id: '',
        contactIdentityNumber: '',
        firstName: '',
        middleName: '',
        firstLastName: '',
        secondLastName: '',
        emailAddress: '',
        name: ''
    }
});

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case actions.FIND_GROUP_FAVORITE_CONTACTS:
            const response = get(action.payload, 'data.data', []);
            return state.withMutations(map => {
                map
                    .set('status', 'processed')
                    .set('totalGroupByFiltered', get(response, 'rowCount', 0))
                    .set('responseGroup', get(response, 'rows', []));
            });


        case actions.CHANGE_PAGE_FOR_GROUP:
            return state.set('pageNum', action.currentPage);


        case actions.CHANGE_KEYWORD_NAME_GROUP:
            return state.set('keywordName', action.keywordName);

        case actions.CHANGE_KEYWORD_NAME_NEW_GROUP:
            let newGroupChange = Immutable.Map({
                id: state.get('group').get('id'),
                name: action.keywordName,
                listContact: state.get('group').get('listContact'),
                pageNum: state.get('group').get('pageNum')
            });

            return state.set('group', newGroupChange);


        case actions.INITIAL_VALUES_GROUPS:
            const response3 = get(action.payload, 'data.data', []);
            return state.withMutations(map => {
                map
                    .set('status', 'processed')
                    .set('keywordName', '')
                    .set('pageNum', 1)
                    .set('totalGroupByFiltered', get(response3, 'rowCount', 0))
                    .set('responseGroup', get(response3, 'rows', []));
            });


        case actions.GET_GROUP_FOR_ID:
            let response4 = get(action.payload, 'data.data', []);
            let group = Immutable.Map({
                id: response4.id,
                name: response4.name,
                listContact: state.get('group').get('listContact')
            });
            return state.set('group', group);


        case actions.GET_LIST_CONTACT_GROUP_FOR_ID:
            let response5 = get(action.payload, 'data.data', []);

            let groupList = Immutable.Map({
                id: state.get('group').get('id'),
                name: state.get('group').get('name'),
                listContact: get(response5, 'rows', [])
            });
            return state.set('group', groupList);

        case actions.VALID_EXISTS_GROUP:
            let response6 = get(action.payload, 'data.data', []);
            let nameSearch = '';

            if (!_.isNull(response6) && !_.isNull(response6.id)) {
                state.set('validExistGroup', true);
                nameSearch = '';
            } else {
                state.set('validExistGroup', false);
            }
            let newGroupSearch = Immutable.Map({
                id: state.get('group').get('id'),
                name: nameSearch,
                listContact: state.get('group').get('listContact')
            });
            return state.set('group', newGroupSearch);
            return state;


        case actions.SEARCH_CONTACT_FOR_GROUP:
            let response7 = get(action.payload, 'data.contactDetail', []);
            response7 = JSON.parse(response7);

            let contactSearch = {
                id: response7.id,
                contactIdentityNumber: response7.contactIdentityNumber,
                firstName: response7.firstName,
                middleName: response7.middleName,
                firstLastName: response7.firstLastName,
                secondLastName: response7.secondLastName,
                emailAddress: response7.emailAddress
            };
            return state.set('contact', contactSearch);
        case actions.ADD_CONTACT_LIST:
            let addContactSearch = state.get('contact');
            let list = state.get('group').get('listContact');
            list.push(addContactSearch);
            return state;

        case actions.CLEAR_CONTACT_NAME:
            let clearContactName = {
                id: '',
                contactIdentityNumber: '',
                firstName: '',
                middleName: '',
                firstLastName: '',
                secondLastName: '',
                emailAddress: '',
                name: ''
            };
            return state.set('contact', clearContactName);


        case actions.DELETE_CONTACT_LIST:
            const id = action.idContact;
            const listContact = state.get('group').get('listContact');
            const listFinal = _.remove(listContact, (item)=> !_.isEqual(item.id, id));

            const groupListContact = Immutable.Map({
                id: state.get('group').get('id'),
                name: state.get('group').get('name'),
                listContact: listFinal
            });

            return state.set('group', groupListContact);

        case actions.SAVE_GROUP_FAVORITE_CONTACTS:
            return state;

        case actions.SAVE_NAME_GROUP:
            const saveNameGroup = Immutable.Map({
                id: state.get('group').get('id'),
                name: action.name,
                listContact: state.get('group').get('listContact')
            });

            return state.set('group', saveNameGroup);


        case actions.RESET_MODAL:
            const resetModal = Immutable.Map({
                id: '',
                name: '',
                listContact: []
            });
            state.set('validExistGroup', false);
            return state.set('group', resetModal);


        case actions.VIEW_EMAIL_CONTACTS:
            let response8 = get(action.payload, 'data.data', []);
            return state.set('viewEmailGroup', response8);

        default:
            return state;
    }
}
