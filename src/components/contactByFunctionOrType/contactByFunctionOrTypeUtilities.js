/**
 * Created by dloaiza 20170426.
 */
import {shorterStringValue, mapDateValueFromTask,formatNumeral} from '../../actionsGlobal';


export const mapDataGrid = (data = []) => {
    return data.map((clientContact, idx) => ({
        clientContactId: clientContact.idClientContact,
        clientId : clientContact.clientId,
        clientIdNumber : clientContact.clientIdNumber,
        clientName: shorterStringValue(clientContact.clientName),
        contactId: clientContact.id,
        contactIdNumber: clientContact.contactIdentityNumber,
        contactNameLink: {
            idContact: clientContact.id,
            idClient: clientContact.clientId,
            nameContact: shorterStringValue(clientContact.completeName),
        },
        contactType: shorterStringValue(clientContact.typeOfContact),
        contactEmail: shorterStringValue(clientContact.emailAddress)
    }));
};
