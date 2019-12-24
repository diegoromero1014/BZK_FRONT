import {shorterStringValue, mapDateValueFromTask} from '../../actionsGlobal';

export const mapDataGrid = (data = []) => {

    return data.map((client, idx) => ({
        typeDocument: client.typeDocument,
        idNumberClient  : client.idNumberClient,
        clientNameLink: {
            id: client.idClient,
            value: shorterStringValue(client.clientName),
            link: '/dashboard/clientEdit',
            hasAccess: client.isAllowedClient
        },
        team: client.team,
        region: client.region,
        zone: client.zone,
        lastUpdateDate: client.lastUpdateDate === null ? "" : mapDateValueFromTask(client.lastUpdateDate)
    }));
};
