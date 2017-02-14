import {shorterStringValue, mapDateValueFromTask} from '../../../actionsGlobal';


export const mapDataGrid = (data = []) => {
    return data.map((client, idx) => ({
        actions: {
            actionView: true,
            id: client.idClient,
            urlServer: "./component",
            component : "VIEW_TASK_ADMIN"
        },
        typeDocument: client.typeDocument,
        idNumberClient  : client.idNumberClient,
        team: client.team,
        region: client.region,
        zone: client.zone,
        lastUpdateDate: client.lastUpdateDate === null ? "" : mapDateValueFromTask(client.lastUpdateDate)
    }));
};

