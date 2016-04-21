import Immutable from 'immutable';
import {GET_CONTACT_DETAILS} from '../constants';

const initialContactDetail = Immutable.Map({
	id: ''
    contactType: '',
    contactIdentityNumber: '',
    firstName: '',
    middleName: '',
    firstLastName: '',
    secondLastName: '',
    socialStyle: '',
    attitudeOverGroup: '',

    dateOfBirth: '',
    country: '',
    province: '',
    city: '',
    address: '',
    neighborhood: '',
    postalCode: '',
    telephoneNumber: '',
    extension: '',
    mobileNumber: '',
    emailAddress: '',

    typeOfContact: '',
    lineOfBusinesses: [],
    functions: [],

    hobbies: [],
    sports: []
});

export default (state = initialContactDetail, action) => {
    switch (action.type) {
        case GET_CONTACT_DETAILS:
        	const response = action.payload.data;
            return state.withMutations(map => {
                map
                .set('id', response.id)
                .set('contactType', response.contactType)
                .set('contactIdentityNumber', response.contactIdentityNumber)
                .set('firstName', response.firstName)
                .set('middleName', response.middleName)
                .set('firstLastName', response.firstLastName)
                .set('secondLastName', response.secondLastName)
                .set('socialStyle', response.socialStyle)
                .set('attitudeOverGroup', response.attitudeOverGroup)
                .set('dateOfBirth', response.dateOfBirth)
                .set('country', response.country)
                .set('province', response.province)
                .set('city', response.city)
                .set('address', response.address)
                .set('neighborhood', response.neighborhood)
                .set('postalCode', response.postalCode)
                .set('telephoneNumber', response.telephoneNumber)
                .set('mobileNumber', response.mobileNumber);
                .set('emailAddress', response.emailAddress)
                .set('typeOfContact', response.typeOfContact)
                .set('lineOfBusinesses', response.lineOfBusinesses)
                .set('functions', response.functions)
                .set('hobbies', response.hobbies)
                .set('sports', response.sports)
            });
            break;
        default:
            return state;
    }
}