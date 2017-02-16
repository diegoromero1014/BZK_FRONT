import {shorterStringValue, getStrDateByDatFormat} from '../../actionsGlobal';
import {getColorCovenant} from '../risksManagement/covenants/covenantsUtilities';

export const mapDataGrid = (data = []) => {
    return data.map((covenant, idx) => ({
        idCovenant: covenant.idCovenant,
        documentClient: covenant.documentClient,
        nameClient: shorterStringValue(covenant.nameClient),
        agreement: covenant.agreement,
        lineOfBusiness: covenant.lineOfBusiness,
        managerAccount: covenant.managerAccount,
        nextExpirationTimestamp: covenant.nextExpirationTimestamp === null ? "" : getStrDateByDatFormat(covenant.nextExpirationTimestamp),
        trafficLight: {
            color: getColorCovenant(covenant.nextExpirationTimestamp, covenant.capitalBalance),
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
