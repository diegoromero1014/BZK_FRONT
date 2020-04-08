import axios from 'axios';
import { APP_URL } from '../../../constantsGlobal';
import {
  GET_CONTACT_DETAILS, SAVE_CONTACT, CLEAR_EDIT_CONTACT, DELETE_RELATOINSHIP_SERVER,
  SET_ARRAY_DELETE_CLIENT_CONTACT, SAVE_UPDATED_INFO_CHECK
} from '../constants';

export function getContactDetails(contactId, clientId) {
  const json = {
    "messageHeader": {
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
      "timestamp": new Date().getTime(),
      "service": '',
      "status": 0,
      "language": 'es',
      "displayErrorMessage": '',
      "technicalErrorMessage": '',
      "applicationVersion": '',
      "debug": true,
      "isSuccessful": true
    },
    "messageBody": {
      "id": contactId,
      "clientId": clientId
    }
  }

  var request = axios.post(APP_URL + '/getContactDetails', json);
  return {
    type: GET_CONTACT_DETAILS,
    payload: request
  }
}

export function clearClienEdit() {
  return {
    type: CLEAR_EDIT_CONTACT
  }
}

export function saveContact(contact) {
  const json = {
    "messageHeader": {
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
      "timestamp": new Date().getTime(),
      "service": '',
      "status": 0,
      "language": 'es',
      "displayErrorMessage": '',
      "technicalErrorMessage": '',
      "applicationVersion": '',
      "debug": true,
      "isSuccessful": true
    },
    "messageBody": {
      "client": contact.client,
      "id": contact.id,
      "title": contact.title,
      "gender": contact.gender,
      "contactType": contact.contactType,
      "contactIdentityNumber": contact.contactIdentityNumber,
      "firstName": contact.firstName,
      "middleName": contact.middleName,
      "firstLastName": contact.firstLastName,
      "secondLastName": contact.secondLastName,
      "contactPosition": contact.contactPosition,
      "unit": contact.unit,
      "function": contact.function,
      "dateOfBirth": contact.dateOfBirth,
      "address": contact.address,
      "country": contact.country,
      "province": contact.province,
      "city": contact.city,
      "neighborhood": contact.neighborhood,
      "postalCode": contact.postalCode,
      "typeOfAddress": null,
      "telephoneNumber": contact.telephoneNumber,
      "extension": contact.extension,
      "mobileNumber": contact.mobileNumber,
      "emailAddress": contact.emailAddress,
      "hobbies": contact.hobbies,
      "sports": contact.sports,
      "modeOfContact": null,
      "registryKey": null,
      "notes": null,
      "typeOfContact": contact.typeOfContact,
      "shippingInformation": null,
      "lineOfBusiness": contact.lineOfBusiness,
      "socialStyle": contact.socialStyle,
      "attitudeOverGroup": contact.attitudeOverGroup,
      "contactRelevantFeatures": contact.contactRelevantFeatures,
      "callFromModuleContact": contact.callFromModuleContact,
      "callFromCommercial": true,
      "interlocutorObjsDTO": contact.interlocutorObjsDTO
    }
  }

  var request = axios.post(APP_URL + '/saveContact', json);
  return {
    type: SAVE_CONTACT,
    payload: request
  }
}
export function markAsOutdated(contact) {
  const json = {
    "messageHeader": {
      "sessionToken": window.localStorage.getItem('sessionTokenFront'),
      "timestamp": new Date().getTime(),
      "service": '',
      "status": 0,
      "language": 'es',
      "displayErrorMessage": '',
      "technicalErrorMessage": '',
      "applicationVersion": '',
      "debug": true,
      "isSuccessful": true
    },
    "messageBody": {
      "updatedInfo":contact.updatedInfo,
      "updatedInfoDesc":contact.updatedInfoDesc,
      "contactType": contact.contactType,
      "contactIdentityNumber": contact.contactIdentityNumber,

    }
  }

  var request = axios.post(APP_URL + '/markAsOutdated', json);
  return {
    type: SAVE_UPDATED_INFO_CHECK,
    payload: request
  }
}
export function setArrayDeleteClientContact(listRelationshipClients) {
  return {
    type: SET_ARRAY_DELETE_CLIENT_CONTACT,
    payload: listRelationshipClients
  }
}

export function deleteRelationshipServer(listClientContactSalve) {
    const json = {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
            "timestamp": new Date().getTime(),
            "service": "",
            "status": "0",
            "language": "es",
            "displayErrorMessage": "",
            "technicalErrorMessage": "",
            "applicationVersion": "",
            "debug": true,
            "isSuccessful": true
        },
        "messageBody": listClientContactSalve
    };

    var request = axios.post(APP_URL + "/deleteRelationshipClientContact", json);
    return {
        type: DELETE_RELATOINSHIP_SERVER,
        payload: request
    }
}
