import {shorterStringValue, mapDateValueFromTask,mapDateValueFromTaskByFormat} from '../../actionsGlobal';
import {getColorCovenant} from '../risksManagement/covenants/covenantsUtilities';
import {DATE_FORMAT} from '../../constantsGlobal';

export const mapDataGrid = (data = []) => {
    return data.map((covenant, idx) => ({
        idCovenant: covenant.idCovenant,
        documentClient: covenant.documentClient,
        nameClient: shorterStringValue(covenant.nameClient),
        agreement: covenant.agreement,
        lineOfBusiness: covenant.lineOfBusiness,
        managerAccount: covenant.managerAccount,
        nextExpirationTimestamp: mapDateValueFromTask(covenant.nextExpirationTimestamp),
        trafficLight: {
            color: getColorCovenant(mapDateValueFromTaskByFormat(covenant.nextExpirationTimestamp,DATE_FORMAT), covenant.capitalBalance),
            // color: 'blue',
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
