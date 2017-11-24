import { GREEN_COLOR, ORANGE_COLOR, RED_COLOR, GRAY_COLOR } from '../../../constantsGlobal';
import { shorterStringValue, formatDateFromDDMMYYY } from '../../../actionsGlobal';
import moment from 'moment';
import _ from 'lodash';

export function getColorCovenant(date, capitalBalance) {
    if (_.isNull(capitalBalance) || _.isEmpty(capitalBalance)) {
        return GRAY_COLOR;
    }
    const dateNextExpiration = moment(date, 'DD/MM/YYYY');
    const initialDate = moment().startOf('month');
    const finalDate = moment().endOf('month');
    const addMonthInitialDate = moment(initialDate).add(1, 'month');
    const addMonthFinalDate = moment(finalDate).add(1, 'month').endOf('month');;

    if (dateNextExpiration.isBefore(initialDate) ||
        (dateNextExpiration.isAfter(initialDate) && dateNextExpiration.isBefore(finalDate))) {
        return RED_COLOR;
    } else if ((dateNextExpiration.isAfter(addMonthInitialDate) || dateNextExpiration.isSame(addMonthInitialDate)) &&
        (dateNextExpiration.isBefore(addMonthFinalDate) || dateNextExpiration.isSame(addMonthFinalDate))) {
        return ORANGE_COLOR;
    } else {
        return GREEN_COLOR;
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
        covenant: shorterStringValue(covenant.covenant),
        agreement: covenant.agreement,
        trafficLight: {
            color: getColorCovenant(covenant.nextExpirationTimestamp, covenant.capitalBalance),
            title: "",
            key: "trafficLight"
        },
        lastUpdateDate: formatDateFromDDMMYYY(covenant.nextExpirationTimestamp)
    }));
};

