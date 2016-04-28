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
      "id": 0,
      "title": 0,
      "gender": 0,
      "contactType": 0,
      "contactIdentityNumber": '',
      "firstName": '',
      "middleName": '',
      "firstLastName": '',
      "secondLastName": '',
      "contactPosition": 0,
      "unit": 0,
      "function": [],
      "dateOfBirth": '',
      "address": '',
      "country": 0,
      "province": 0,
      "city": 0,
      "neighborhood": '',
      "postalCode": '',
      "typeOfAddress": 0,
      "telephoneNumber": '',
      "extension": '',
      "mobileNumber": '',
      "emailAddress": '',
      "hobbies": [],
      "sports": [],
      "modeOfContact": 0,
      "registryKey": '',
      "notes": '',
      "typeOfContact": 0,
      "shippingInformation": '',
      "lineOfBusiness": [],
      "socialStyle": 0,
      "attitudeOverGroup": 0,
      "client": 0
    }
  }

  var request = axios.post(APP_URL + '/saveContact', json);
  return {
    type: SAVE_CONTACT,
    payload: request
  }
}
