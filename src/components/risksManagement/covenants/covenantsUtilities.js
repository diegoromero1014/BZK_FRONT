import {COLOR_RED, COLOR_ORANGE, COLOR_GREEN} from '../../clientInformation/constants';
import {shorterStringValue} from '../../../actionsGlobal';
import moment from 'moment';
import _ from 'lodash';


export function getColorCovenant(date, capitalBalance){
    if( _.isNull(capitalBalance) || _.isEmpty(capitalBalance) ){
        return 'gray';
    }
    const dateNextExpiration = moment(date, 'DD/MM/YYYY');
    const initialDate = moment().startOf('month');
    const finalDate = moment().endOf('month');
    const addMonthInitialDate = moment(initialDate).add(1, 'month');
    const addMonthFinalDate = moment(finalDate).add(1, 'month');

    if( dateNextExpiration.isBefore(initialDate) || 
        ( dateNextExpiration.isAfter(initialDate) && dateNextExpiration.isBefore(finalDate) ) ){
        return COLOR_RED;
    } else if( dateNextExpiration.isAfter(addMonthInitialDate) && dateNextExpiration.isBefore(addMonthFinalDate) ){
        return COLOR_ORANGE;
    } else {
        return COLOR_GREEN;
    }
}

export const mapDataGrid = (data = []) => {
    return data.map((covenant, idx) => ({
        actions: {
            actionView: true,
            id: covenant.idCovenant,
            urlServer: "./component",
            component: "VIEW_TRACKING_COVENANT"
        },
        idCovenant: covenant.idCovenant,
        lineOfBusiness: covenant.lineOfBusiness,
        managerAccount: covenant.managerAccount,
        descriptionRecord: shorterStringValue(covenant.descriptionRecord),
        agreement: covenant.agreement,
        trafficLight: {
            color: getColorCovenant(covenant.nextExpirationTimestamp, covenant.capitalBalance),
            title: "",
            key: "trafficLight"
        },
        lastUpdateDate: covenant.nextExpirationTimestamp
    }));
};

