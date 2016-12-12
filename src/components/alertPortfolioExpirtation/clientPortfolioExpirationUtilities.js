/**
 * Created by user- on 12/6/2016.
 */
import {shorterStringValue, mapDateValueFromTask,formatNumeral} from '../../actionsGlobal';


export const mapDataGrid = (data = []) => {

    return data.map((client, idx) => ({
        typeDocument: client.typeDocument,
        idNumberClient  : client.idNumberClient,
        clientNameLink: {
            id: client.idClient,
            value: shorterStringValue(client.clientName),
            link: '/dashboard/clientInformation'
        },
        balance: formatNumeral(client.balance,'$ 0,0[.]00'),
        daysOverdue: client.daysOverdue,
        entity: client.entity,
        responsible: shorterStringValue(client.responsible)
    }));
};
