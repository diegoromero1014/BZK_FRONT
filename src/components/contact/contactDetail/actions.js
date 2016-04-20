import {APP_URL} from '../../../constantsGlobal';
import {GET_CONTACT_DETAILS} from '../constants';
import axios from 'axios';

/**
 * Metodo para llamar al servicio y traer la informacion del contacto por su identficacion
 * @param contactId
 */
export function getContactDetails(contactId) {
  const json = {
    messageHeader: {
      sessionToken: window.localStorage.getItem('sessionToken'),
      timestamp: new Date().getTime(),
      service: '',
      status: 0,
      language: 'es',
      displayErrorMessage: '',
      technicalErrorMessage: '',
      applicationVersion: '',
      debug: true,
      isSuccessful: true
    },
    messageBody: {
      contactId: window.localStorage.getItem('contactId')
    }
  }

  var request = axios.post(APP_URL, '/getContactDetails', json);

  return {
    type: GET_CONTACT_DETAILS,
    payload: request
  }
}