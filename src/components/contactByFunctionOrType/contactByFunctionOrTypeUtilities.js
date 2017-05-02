/**
 * Created by dloaiza 20170426.
 */
import {shorterStringValue, mapDateValueFromTask, formatNumeral} from '../../actionsGlobal';
import {VIEW_CONTACT} from '../grid/constants';


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
            text: shorterStringValue(clientContact.completeName),
            modalTitle: "Detalle del contacto",
            component: VIEW_CONTACT
        },
        contactType: shorterStringValue(clientContact.typeOfContact),
        contactEmail: shorterStringValue(clientContact.emailAddress),
        delete:{

        }
    }));
};
