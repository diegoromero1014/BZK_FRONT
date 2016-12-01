import {shorterStringValue, mapDateValueFromTask} from '../../actionsGlobal';


export const mapDataGrid = (data = []) => {
    return data.map((client, idx) => ({
        actionsRedirect: {
            actionView: true,
            id: client.idClient,
            urlServer: "./component",
            typeClickDetail: 'clientEdit',
            urlRedirect: '/dashboard/clientEdit'
        },
        typeDocument: client.typeDocument,
        idNumberClient  : client.idNumberClient,
        clientName: shorterStringValue(client.clientName),
        team: client.team,
        region: client.region,
        zone: client.zone,
        lastUpdateDate: client.lastUpdateDate === null ? "" : mapDateValueFromTask(client.lastUpdateDate)
    }));
};
