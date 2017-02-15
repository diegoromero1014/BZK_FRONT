import {shorterStringValue, mapDateValueFromTask} from '../../actionsGlobal';


export const mapDataGrid = (data = []) => {
    return data.map((covenant, idx) => ({
        typeDocument: covenant.typeDocument,
        idNumberClient: covenant.idNumberClient,
        clientName: shorterStringValue(covenant.clientName),
        agreement: covenant.agreement,
        lineOfBusiness: covenant.lineOfBusiness,
        manager: covenant.manager,
        expirationDate: covenant.expirationDate === null ? "" : mapDateValueFromTask(covenant.expirationDate),
        trafficLight: {
            // color: getColorCovenant(covenant.expirationDate, covenant.capitalBalance),
            color:"blue",
            title: "",
            key: "trafficLight"
        },
        actions: {
            actionView: true,
            id: covenant.idCovenant,
            urlServer: "./component",
            component: "VIEW_TRACKING_COVENANT"
        },
    }));
};
