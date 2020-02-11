import Immutable from 'immutable';
import * as actions from './constants';
import { get, differenceBy } from 'lodash';
import { stringValidate, joinName } from '../../../actionsGlobal';
import { FIRST_PAGE } from './constants';

const initialState = Immutable.Map({
    status: "withoutProcessing",
    keywordName: "",
    pageNum: FIRST_PAGE,
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
    },
    contactByFunctionOrTypeSelected: Immutable.List(),
    totalContactsByFunctionOrType: 0,
    pageNumContactsByFunctionOrType: FIRST_PAGE,
    keywordContactsByFunctionOrType: '',
    functionContactsByFunctionOrTpe: null,
    typeContactsByFunctionOrType: null,
    lowerLimitContactsByFunctionOrType: 0,
    listGroupFavorite: []
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
            } else {
                state.set('validExistGroup', false);
            }
            let newGroupSearch = Immutable.Map({
                id: state.get('group').get('id'),
                name: nameSearch,
                listContact: state.get('group').get('listContact')
            });
            return state.set('group', newGroupSearch);
        case actions.SEARCH_CONTACT_FOR_GROUP:
            let response7 = action.payload.data.data;
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
            const contactAdd = {
                id: addContactSearch.id,
                document: addContactSearch.contactIdentityNumber,
                completeName: joinName(addContactSearch.firstName, addContactSearch.middleName, addContactSearch.firstLastName, addContactSearch.secondLastName),
                email: addContactSearch.emailAddress
            };
            let list = state.get('group').get('listContact');
            list.push(contactAdd);
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
            const listFinal = _.remove(listContact, (item) => !_.isEqual(item.id, id));
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
        case actions.CLEAR_EMAILS:
            return state.set('viewEmailGroup', '');
        case actions.GET_CONCTACTS_BY_FUNCTIONS_OR_TYPE:
            var data = get(action.payload, 'data.data.rows', []);
            var newData = differenceBy(data, state.get('group').get('listContact'), 'id');
            newData.map(item => {
                if (!stringValidate(item.email)) {
                    item.checked = false;
                } else {
                    item.checked = true;
                }
                item.show = true;
            });
            return state
                .set('totalContactsByFunctionOrType', get(action.payload, 'data.data.rowCount', []))
                .set('contactByFunctionOrTypeSelected', newData);
        case actions.CHANGE_STATE_CONTACT_BY_FUNCTION_OR_TYPE:
            const listContactsByFunctionOrType = state.get('contactByFunctionOrTypeSelected');
            var newList = [];
            listContactsByFunctionOrType.map(item => {
                if (item.id === action.idContact) {
                    item.checked = !item.checked;
                }
                newList.push(item);
            });
            return state.set('contactByFunctionOrTypeSelected', newList);
        case actions.ASSOCIATE_CONTACTS_BY_FUNCTION_OR_TYPE:
            let listContactPayload = state.get('group').get('listContact');
            listContactPayload.push(...action.listContactsByFunctionOrType);
            var newGroup = Immutable.Map({
                id: state.get('group').get('id'),
                name: state.get('group').get('name'),
                listContact: listContactPayload
            });
            return state.set('group', newGroup);
        case actions.CHANGE_PAGE_CONTACTS_BY_FUNCTION_OR_TYPE:
            return state.set('pageNumContactsByFunctionOrType', action.pageNum);
        case actions.LOWER_LIMIT_CONTACTS_BY_FUNCTION_OR_TYPE:
            return state.set('lowerLimitContactsByFunctionOrType', action.lowerLimit);
        case actions.SET_KEYWORD_CONTACTS_BY_FUNCTION_OR_TYPE:
            return state.set('keywordContactsByFunctionOrType', action.keyword);
        case actions.SET_FUNCTION_CONTACTS_BY_FUNCTION_OR_TYPE:
            return state.set('functionContactsByFunctionOrTpe', action.functionContact);
        case actions.SET_TYPE_CONTACTS_BY_FUNCTION_OR_TYPE:
            return state.set('typeContactsByFunctionOrType', action.type);
        case actions.SET_CONTACTS_BY_FUNCTION_OR_TYPE:
            return state.set('contactByFunctionOrTypeSelected', action.listContacts);
        case actions.LIST_CONTACT_GROUP_FOR_ID:
            return state.set('listGroupFavorite', action.payload.data.data);
        default:
            return state;
    }
}
