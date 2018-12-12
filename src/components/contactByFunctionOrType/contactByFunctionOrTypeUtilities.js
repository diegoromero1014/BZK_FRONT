/**
 * Created by dloaiza 20170426.
 */
import {shorterStringValue, joinName} from '../../actionsGlobal';
import {VIEW_CONTACT} from '../grid/constants';
import {DELETE_MESSAGE,DELETE_CONTACT_FROM_FUNCTION_OR_TYPE} from './constants';


export const mapDataGrid = (data = []) => {
    return data.map((clientContact, idx) => ({
        clientContactId: clientContact.idClientContact,
        clientId: clientContact.clientId,
        clientIdNumber: clientContact.clientIdNumber,
        clientName: shorterStringValue(clientContact.clientName),
        contactId: clientContact.id,
        contactIdNumber: clientContact.contactIdentityNumber,
        modalNameLink: {
            id: {
                contactId: clientContact.id,
                clientId: clientContact.clientId
            },
            text: shorterStringValue(joinName(clientContact.firstName, clientContact.middleName, clientContact.firstLastName, clientContact.secondLastName)),
            modalTitle: "Detalle del contacto",
            component: VIEW_CONTACT
        },
        contactType: shorterStringValue(clientContact.typeOfContact),
        contactEmail: shorterStringValue(clientContact.emailAddress),
        delete:{
            actionDelete: true,
            urlServer: "/deleteContactForClient",
            typeDelete: DELETE_CONTACT_FROM_FUNCTION_OR_TYPE,
            mensaje: DELETE_MESSAGE + clientContact.clientName + "?",
            json: {
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
                "messageBody": {
                    "clientId": clientContact.clientId,
                    "contactId": clientContact.id,
                    "clientContactId": clientContact.idClientContact
                }
            }
        }
    }));
};
