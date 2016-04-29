import {APP_URL} from '../../../constantsGlobal';
import {GET_CONTACT_DETAILS, SAVE_CONTACT} from '../constants';
import axios from 'axios';

/**
 * Metodo para llamar al servicio y traer la informacion del contacto por su identficacion
 * @param contactId
 */
export function getContactDetails(contactId, clientId) {
  const json = {
    "messageHeader": {
      "sessionToken": window.localStorage.getItem('sessionToken'),
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

export function saveContact(contact) {
  const json = {
    "messageHeader": {
      "sessionToken": window.localStorage.getItem('sessionToken'),
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
      "attitudeOverGroup": contact.attitudeOverGroup
    }
  }

  var request = axios.post(APP_URL + '/saveContact', json);
  return {
    type: SAVE_CONTACT,
    payload: request
  }
}
